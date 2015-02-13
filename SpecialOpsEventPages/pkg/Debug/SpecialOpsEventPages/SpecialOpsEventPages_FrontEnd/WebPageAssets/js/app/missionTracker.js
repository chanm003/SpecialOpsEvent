define(function (require) {

    //dependencies
    var $ = require('jquery'),
        jqueryui = require('jqueryui'),
        commonUI = require('app/commonUI'),
        datacontext = require('app/datacontext'),
        datatables = require('datatablesGrouped'),
        gantt = require('gantt'),
        handlebars = require('handlebars'),
        moment = require('moment'),
        qtip = require('qtip'),
        queryString = require('queryString'),
        timeago = require('timeago'),
        underscore = require('underscore'),
        vex = require('vex'),
        vexDialog = require('vexDialog');

    vex.defaultOptions.className = 'vex-theme-os';

    var modalTemplate = handlebars.compile($("#chopForm").html());

    var exposedAPI = {
        render: render
    }

    function filterOutConops(missionDocs, chops, reviewers) {
        var conops = _.where(missionDocs, { docType: "CONOP Concept of Operations" });
        var conopsChopsGroupedByURL = _.groupBy(chops, 'uniqueID');

        conops = _.map(conops, function (item) {
            item.reviewForms = {};
            _.each(reviewers, function (reviewer) {
                item.reviewForms[reviewer] = _.findWhere(chops, { uniqueID: item.uniqueID, signOnBehalfOf: reviewer });
            });

            item.overallChopStatus = deriveOverallChopStatus(item.reviewForms, reviewers.length);
            return item;
        });

        function deriveOverallChopStatus(reviewForms, numOfReviewers) {
            var reviewersThatHaveNotChopped =
				_.chain(reviewForms)
					.pick(function (value, key, object) {
					    return value === undefined;
					})
					.keys()
					.value();

            if (reviewersThatHaveNotChopped.length === numOfReviewers) {
                return "New";
            }

            //OTHERWISE
            var verdicts =
				_.chain(reviewForms)
					.omit(function (value, key, object) {
					    return value === undefined;
					})
					.values()
					.pluck("verdict")
					.groupBy()
					.value();

            if (verdicts["Disapproved"]) {
                return "Disapproved";
            } else {
                return (verdicts["Approved"].length === numOfReviewers) ? "Approved" : "In Chop";
            }

        }

        //sort by status, so we can later group by status
        conops = _.sortBy(conops, function (item) {
            return item.overallChopStatus;
        });

        return conops;
    }

    function render(data) {
        var reviewers = ['J35', 'J39', 'J2', 'MED', 'JAG', 'SOATG'];
        data.conops = filterOutConops(data.missionDocs, data.conopChops, reviewers);
        renderConopChopsTable(data.conops, data.conopChops, reviewers);
        renderMissionDocumentsTable(data.missionDocs);
        renderMissionTrackerTable(data.missionData);
        
        renderTabs();

        //run this after the tabs are shown
        renderTimeline(data.missionData);
    }



    function renderConopChopsTable(conops, chops, reviewers) {


        //DataTables configurations
        var columns = [
            { title: "Status" }, //GROUPBY COL,
            { title: "Mission" },
            { title: "CONOP" },
            { title: "Organization" }
        ];

        _.each(reviewers, function (reviewer) {
            columns.push({ title: reviewer });
        });

        var linkColumDef = {
            render: function (item, type, row) {
                var html = "";

                html = "<a target='_blank' title='View " + item.fileName + "' href='" + item.serverRelativeDocumentUrl + "'>" + item.fileName + "</a>";

                return html;
            },
            targets: 2
        };

        var reviewProcessColumDef = {
            render: function (reviewColumn, type, row) {
                return generateHtmlForReviewProcess(reviewColumn.conop, reviewColumn.reviewer);
            },
            targets: [4, 5, 6, 7, 8, 9]
        };

        function generateHtmlForReviewProcess(conop, reviewer) {
            var html = "",
            	userProfileUrl = '',
            	faIcon = '';

            var chopForm = conop.reviewForms[reviewer];


            if (chopForm) {
                userProfileUrl = _spPageContextInfo.webServerRelativeUrl + "/_layouts/userdisp.aspx?ID=" + chopForm.editor.userId;

                if (chopForm.verdict === "Approved") {
                    faIcon = '<i style="color:green;" class="fa fa-thumbs-up fa-lg"></i> ';
                } else if (chopForm.verdict === "Disapproved") {
                    faIcon = '<i style="color:red;" class="fa fa-thumbs-down fa-lg"></i> ';
                }

                html += '<div style="white-space: nowrap;">'
                html += faIcon + "<a style='display:inline-block;' data-chop-list-item-id='" + chopForm.id + "' ";
                html += "class='alreadyReviewed' href='" + userProfileUrl + "'>" + chopForm.editor.userName + "</a>";
                html += "</div>";
            } else {
                //no review form, so generate link for user to sign
                html += "<a class='custombtn chopbtn' data-reviewer='" + reviewer + "' data-conop-id='" + conop.id + "'>Chop</a>";
            }

            return html;
        }

        var dtSource = _.map(conops, function (item, index) {
            var strArr = [];

            strArr.push("Overall Chop Status: " + item.overallChopStatus);
            strArr.push(item.missionName);
            strArr.push(item);
            strArr.push(item.organization);
            _.each(reviewers, function (reviewer) {
                strArr.push({
                    reviewer: reviewer,
                    conop: item
                });
            });
            return strArr;
        });

        function addModalFunctionalityForChopButton() {

            tblConopChops.on('click', ".chopbtn", function (evt) {
                evt.preventDefault();

                var link = $(this),
	    			conopID = parseInt(link.attr("data-conop-id"), 10),
	    			reviewer = link.attr("data-reviewer"),
	    			conop = _.findWhere(tblConopChops.data().conopsLookupArray, { id: conopID });

                var generatedHtml = modalTemplate({ conop: conop, reviewer: reviewer });

                vex.open({
                    content: generatedHtml
                });
            });
        }

        function addQtipFunctionality() {
            tblConopChops.on('mouseenter', 'a.alreadyReviewed', function (evt) {
                $(this).qtip({
                    content: {
                        title: function (evt, api) {
                            var link = $(this),
                				chopListItemId = parseInt(link.attr('data-chop-list-item-id'), 10),
                				chopReviewForm = _.findWhere(tblConopChops.data().chopsLookupArray, { id: chopListItemId }),
                				modifiedMoment = moment(chopReviewForm.modified),
                    			isoString = modifiedMoment.utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";

                            return chopReviewForm.verdict + ' <span style="font-size:0.7em;color:#808080;"><abbr class="timeago" style="white-space:nowrap;" title="' + isoString + '">&nbsp;</abbr></span>';

                        },
                        text: function (evt, api) {
                            var link = $(this),
                            	spacer = '<img src="/_layouts/images/blank.gif" height="1px" width="200px"/>',
                				chopListItemId = parseInt(link.attr('data-chop-list-item-id'), 10),
                				chopReviewForm = _.findWhere(tblConopChops.data().chopsLookupArray, { id: chopListItemId });

                            return chopReviewForm.comments + spacer;
                        }
                    },
                    events: {
                        visible: function (evt, api) {
                            $("abbr.timeago", evt.currentTarget).timeago();
                        }
                    },
                    position: {
                        my: 'top right',
                        at: 'bottom right'
                    },
                    show: {
                        ready: true
                    },
                    style: {
                        classes: 'qtip-light qtip-bootstrap'
                    }
                });
            });
        }

        function addSignConopFunctionality() {

            $(document).on('click', '.btnSave', function (evt) {
                evt.preventDefault();

                var modalForm = $(this).closest(".vex-content");

                var signedChop = {
                    reviewerChopStatus: $(".reviewerChopStatus", modalForm).val(),
                    reviewerComments: $(".reviewerComments", modalForm).val(),
                    conopID: $(".conopID", modalForm).val(),
                    reviewer: $(".reviewer", modalForm).val(),
                    libraryForConop: $(".libraryForConop", modalForm).val()
                };

                if (!signedChop.reviewerChopStatus) {
                    alert("Please select a Chop Status");
                    return;
                }

                datacontext.signChopForm(signedChop)
               		.then(function () {
               		    window.location.reload(true);
               		});
            });
        }


        var tblConopChops = $("#tblConopChops");

        tblConopChops.data({
            conopsLookupArray: conops,
            chopsLookupArray: chops
        });

        tblConopChops.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: false,
            data: dtSource,
            columns: columns,
            columnDefs: [linkColumDef, reviewProcessColumDef]
        })
        .rowGrouping({ bExpandableGrouping: true });

        addQtipFunctionality();
        addModalFunctionalityForChopButton();
        addSignConopFunctionality();
    }

    function renderMissionDocumentsTable(data) {
        //DataTables configurations
        var columns = [
            { title: "Mission" }, //GROUPBY COL,
            { title: "Document Type" },
            { title: "Name" },
            { title: "Organization" },
            { title: "Modified" },
            { title: "Modified By" }
        ];


        var linkColumDef = {
            render: function (item, type, row) {
                var html = "";

                html = "<a target='_blank' title='View " + item.fileName + "' href='/" + item.fileRef.lookupValue + "'>" + item.fileName + "</a>";

                return html;
            },
            targets: 2
        };

        var userNameColumDef = {
            render: function (editor, type, row) {
                var html = "";

                var url = _spPageContextInfo.webServerRelativeUrl + "/_layouts/userdisp.aspx?ID=" + editor.userId;
                html = "<a title='View Profile for " + editor.userName + "' href='" + url + "'>" + editor.userName + "</a>";

                return html;
            },
            targets: 5
        };

        //sort by mission name, so we can later group by mission name
        data = _.sortBy(data, function (item) {
            return item.missionName;
        });

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            strArr.push("Mission: " + item.missionName);
            strArr.push(item.docType);
            strArr.push(item);
            strArr.push(item.organization);
            strArr.push(item.modified.format("M/D/YYYY H:mm A"));
            strArr.push(item.editor);
            return strArr;
        });

        var tblMissionDocuments = $("#tblMissionDocuments");
        tblMissionDocuments.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [userNameColumDef, linkColumDef]
        })
        .rowGrouping({ bExpandableGrouping: true });

    }

    function renderMissionTrackerTable(data) {
        //DataTables configurations
        var columns = [
            { title: "Status" }, //GROUPBY COL
            { title: "", width: "1%" },
            { title: "Mission#" },
            { title: "Title" },
            { title: "SOTG" },
            { title: "DateTimeGroup(hidden for sorting purposes)", visible: false },
            { title: "DateTimeGroup(hidden for sorting purposes)", visible: false },
            { title: "DateTimeGroup(hidden for sorting purposes)", visible: false },
            { title: "Mission Approved", width: "1%" },
            { title: "Expected Execution", width: "1%" },
            { title: "Expected Termination", width: "1%" },
            { title: "Comments" }
        ];

        var attachmentColumDef = {
            render: function (data, type, row) {
                var html = "";

                if (data) {
                    html = "<img src='/_layouts/images/attach.gif' class='ms-vb-lvitemimg' title='Attachment' alt='Attachment' border='0' />";
                }

                return html;
            },
            targets: 1
        };

        var linkColumDef = {
            render: function (item, type, row) {
                var html = "";

                html = "<a title='Details: " + item.title + "' class='showSharePointModal' href='" + item.dispFormUrl + "&IsDlg=1'>" + item.title + "</a>";

                return html;
            },
            targets: 3
        };

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            var missionApproved = "", 
                missionApprovedDate = "", 
                execution = "", 
                executionDate = "", 
                termination = "", 
                terminationDate = "";

            if(item.missionApproved.isValid()) {
                missionApproved = (item.missionApproved.format("DDHHmm") + "Z" + item.missionApproved.format("MMMYY")).toUpperCase();
                missionApprovedDate = item.missionApproved.toDate();
            }
            if(item.expectedExecution.isValid()) {
                execution = (item.expectedExecution.format("DDHHmm") + "Z" + item.expectedExecution.format("MMMYY")).toUpperCase();
                executionDate = item.expectedExecution.toDate();
            }
            if(item.expectedTermination.isValid() ){
                termination = (item.expectedTermination.format("DDHHmm") + "Z" + item.expectedTermination.format("MMMYY")).toUpperCase();
                terminationDate = item.expectedTermination.toDate();
            }
            strArr.push("Status: " + item.status);
            strArr.push(item.hasAttachment);
            strArr.push(item.missionNumber);
            strArr.push(item);
            strArr.push(item.sotg);
            strArr.push(missionApprovedDate);
            strArr.push(executionDate);
            strArr.push(terminationDate);
            strArr.push(missionApproved);
            strArr.push(execution);
            strArr.push(termination);
            strArr.push(item.comments);
            return strArr;
        });

        var tblMissionTracker = $("#tblMissionTracker");
        tblMissionTracker.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [
                attachmentColumDef,
                linkColumDef,
                { "iDataSort": 5, "aTargets": [8] },
                { "iDataSort": 6, "aTargets": [9] },
                { "iDataSort": 7, "aTargets": [10] }
            ]
        })
        .rowGrouping({ bExpandableGrouping: true });

        commonUI.addModalBehavior(tblMissionTracker, ".showSharePointModal");
    }

    function renderTabs() {
        $("#tabs")
            .tabs({
                active: commonUI.getActiveJqueryTabFromUrlHash(),
                activate: commonUI.changeUrlHashWhenJqueryTabSelected
            })
   			.show(function () {
   			    $(this).find("ul").show();
   			});


        /*
        function moveGanttListViewWebpartFromOffViewportToJqueryTab() {
            //gantt list-viewbpart resides in tab-1 which is hidden on page load
            //HACK: OOTB web part does not render properly when residing in hidden DIV
            var firstTab = $("#tabs-1");
            var lvwp = $("#ganttViewWebpart [id^=MSOZoneCell_WebPartWPQ]"),
                focusListViewWebpartHackImplemented = false;
            firstTab.append($("#ganttViewWebpart > table"));
            setFocusToGanttViewWebpart();

            $("#tabs").tabs({
                activate: setFocusToGanttViewWebpart
            });

            function setFocusToGanttViewWebpart() {
                var selectedTab = $("#tabs").tabs('option', 'active'),
	   				isFirstTabSelected = (selectedTab === 0);

                location.hash = selectedTab;
                if (lvwp.size() && isFirstTabSelected && !focusListViewWebpartHackImplemented) {
                    //set "focus" to webpart, simulating a user click
                    //this forces the ribbon to change contextually and resizes gantt view
                    var elem = document.getElementById(lvwp.attr("id"));
                    var dummyevent = new Array();
                    dummyevent["target"] = elem;
                    dummyevent["srcElement"] = elem;
                    WpClick(dummyevent);
                    focusListViewWebpartHackImplemented = true;
                }

                if (!isFirstTabSelected) {
                    //SHOULD: to change the selected tab in ribbon to "Browse"

                }
            }

        }
        */
    }


    function renderTimeline(missions) {
        missions = _.filter(missions, function (item) {
            return (item.expectedExecution.isValid() && item.expectedTermination.isValid());
        });

        var seriesData = _.map(missions, function (item) {
            var jqgItem = {
                name: item.title,
                start: item.expectedExecution.startOf('day').toDate(),
                end: item.expectedTermination.startOf('day').toDate()
            };
            return jqgItem;
        });


        $("#ganttChart").ganttView({
            data: [
		    	{
		    	    id: 1,
		    	    name: "This property not used by SOCEUR's gantt-view implementation",
		    	    series: seriesData
		    	}
            ],
            slideWidth: 900,
            behavior: {
                draggable: false
            }
        });
    }




    return exposedAPI;
});


/*
missionTracker.aspx still being provisioned, but OOTB LVWP is not

<File Type="GhostableInLibrary" Path="app\missionTracker.aspx" Url="app/missionTracker.aspx">
    <View List="Lists/MissionTracker" BaseViewID="4" Type="GANTT" WebPartZoneID="timeline" WebPartOrder="1" ContentTypeID="0x">
        <![CDATA[
                     <WebPart xmlns="http://schemas.microsoft.com/WebPart/v2">
                          <Assembly>Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c</Assembly>
                          <TypeName>Microsoft.SharePoint.WebPartPages.ListViewWebPart</TypeName>
                     </WebPart>
                    ]]>
    </View>
</File>
*/