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
        timeago = require('timeago'),
        underscore = require('underscore');

    var asrColorLegend = {
        "Requested": {bgColor: "#FF69B4", foreColor: "#000000"},
        "Vetted by SOATG": { bgColor: "#FFFF00", foreColor: "#000000" },
        "Scheduled": { bgColor: "#336600", foreColor: "#ffffff" },
        "Disapproved": { bgColor: "#ff0000", foreColor: "#ffffff" },
        "Canceled": { bgColor: "#ffa500", foreColor: "#000000" },
        "Unable to Support": { bgColor: "#8e2b2b", foreColor: "#ffffff" },
        "MSN Complete": { bgColor: "#4747b5", foreColor: "#ffffff" }
    };


    var exposedAPI = {
        render: render
    }

    function render(data) {
        renderMissionTrackerTable(data);
        
        renderTabs();

        //run this after the tabs are shown
        renderTimeline(data);
        renderColorLegend(asrColorLegend);
    }

    function renderColorLegend(colorLegend) {
        $("#ganttChart").before('<div class="ms-vb2"><a class="timelineLegend" href="#">View Legend</a></div>');

        var tableHtml = '<table>';

        for (key in colorLegend) {
            var legendItem = colorLegend[key];
            tableHtml += "<tr><td style='width: 12px;height: 12px; border:solid 1px #ccc;background-color: " + legendItem.bgColor + "'>&nbsp;</td><td>" + key + "</td></tr>";
        }

        tableHtml += '</table>';

        var legend = $(tableHtml);

        $("a.timelineLegend").qtip({
            content: {
                text: legend
            }, style: {
                classes: 'qtip-dark qtip-shadow qtip-rounded'
            }
        });
                   
    }

    function renderMissionTrackerTable(data) {
        //DataTables configurations
        var columns = [
            { title: "", width: "1%" },
            { title: "Mission Title" },
            { title: "MSN Status" },
            { title: "MSN Start Date" },
            { title: "MSN End Date" },
            { title: "Requestor Rank/Title" }
        ];

        var attachmentColumDef = {
            render: function (data, type, row) {
                var html = "";

                if (data) {
                    html = "<img src='/_layouts/images/attach.gif' class='ms-vb-lvitemimg' title='Attachment' alt='Attachment' border='0' />";
                }

                return html;
            },
            targets: 0
        };

        var linkColumDef = {
            render: function (item, type, row) {
                var html = "";

                html = "<a title='Details: " + item.title + "' class='showSharePointModal' href='" + item.dispFormUrl + "&IsDlg=1'>" + item.title + "</a>";

                return html;
            },
            targets: 1
        };

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            strArr.push(item.hasAttachment);
            strArr.push(item);
            strArr.push(item.status);
            strArr.push(item.missionStartDate.format('M/D/YYYY'));
            strArr.push(item.missionEndDate.format('M/D/YYYY'));
            strArr.push(item.requestorRankTitle);
            return strArr;
        });

        var tblMissionTracker = $("#tblMissionTracker");
        tblMissionTracker.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            order: [[3, 'asc'],[4, 'asc']],
            columns: columns,
            columnDefs: [attachmentColumDef, linkColumDef]
        });

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
    }


    function renderTimeline(missions) {

        var seriesData = _.map(missions, function (item) {
            var jqgItem = {
                name: item.title,
                start: item.missionStartDate.startOf('day').toDate(),
                end: item.missionEndDate.startOf('day').toDate(),
                color: asrColorLegend[item.status].bgColor
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


