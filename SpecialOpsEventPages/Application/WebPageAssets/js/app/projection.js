define(function (require) {

    //dependencies
    var $ = require('jquery'),
        commonUI = require('app/commonUI'),
    	commsTables = require('app/commsTables'),
        datatables = require('datatablesGrouped'),
        moment = require('moment'),
        timeago = require('timeago'),
        underscore = require('underscore');

    //configure dependencies before use (probably should centralize)
    jQuery.timeago.settings.allowFuture = true;

    var exposedAPI = {
        render: render
    }

    function addScrollingBehavior() {
        if (sessionStorage.getItem("shouldScroll")) {
            setTimeout(function () {
                //console.log('started auto');
                startScrolling();
            }, 500);
        }

        listenForWindowScroll();
        listenForScrollButtonClicks();

        function isUserAtBottomOfPage() {
            return $(window).scrollTop() + $(window).height() == $(document).height();
        }

        function listenForWindowScroll() {
            $(window).scroll(function () {
                if (isUserAtBottomOfPage()) {

                    if (sessionStorage.getItem("shouldScroll")) {
                        //refresh page
                        location.reload(true);
                    }
                }
            });
        }

        var timer;
        function listenForScrollButtonClicks() {
            $("#autoscroll").click(function () {
                sessionStorage.setItem("shouldScroll", true);
                startScrolling();
            });
            $("#autostop").click(function () {
                sessionStorage.removeItem("shouldScroll");
                clearInterval(timer);
            });
        }

        function startScrolling() {
            timer = setInterval(scrollPage, 30);
        }

        function getCurrentPosition() {
            var currentPos;
            if (document.all) {
                currentPos = document.documentElement.scrollTop + 1;
            } else {
                currentPos = window.pageYOffset + 1;
            }
            return currentPos;
        }

        function scrollPage() {
            window.scroll(0, getCurrentPosition());
        }
    }

    function render(data) {
        addScrollingBehavior();
        var container = $('div.appContainer');

        renderCCIRTable(container, data.ccirData);
        renderWatchlogTable(container, data.watchlogData);
        renderBattleRhythmTable(container, data.battleRhythmData);
        renderMessageTrafficTable(container, data.inboundMessageData, "Inbound Message Traffic", "tblInboundMessages");
        renderMessageTrafficTable(container, data.outboundMessageData, "Outbound Message Traffic", "tblOutboundMessages");
        renderMissionTrackerTable(container, data.missionData);

        commonUI.renderWebPartHeaderTag(container, "/Lists/CommunicationsStatus/EditableGrid.aspx", "Overall Communication Status");
        commsTables.renderCommsTable(container, data.commsData);

        renderRfiTable(container, data.rfiData);
    }

    function renderBattleRhythmTable(container, data) {
        //DataTables configurations
        var columns = [
            { title: "Start", width: "1%" },
            { title: "End", width: "1%" },
            { title: "Title" },
            { title: "Comments" }
        ];

        var timeagoColumDef = {
            render: function (battleRhythmEvent, type, dataRow) {
                var columnOutput = '',
                    startMoment = battleRhythmEvent.eventDate,
                    verb = (startMoment > moment()) ? "will start" : "started",
                    timePortion = startMoment.format("HHmm"),
                    isoString = startMoment.utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";


                if (!!battleRhythmEvent.location) {
                    columnOutput += "Location: " + battleRhythmEvent.location + ", ";
                }
                columnOutput += verb + ' <abbr class="timeago" style="white-space:nowrap;" title="' + isoString + '">' + timePortion + '</abbr>';

                return columnOutput;
            },
            targets: 3
        };

        //Template
        var html =
            "<div class='appPart'>\
                <h3 style='text-align:justify;' class='ms-standardheader ms-WPTitle'>\
    		        <a href='"+ requirejs.spWebURL + "/Lists/ExerciseCalendar'>\
    		            <nobr><span>Battle Rhythm (Next 24 Hours)</span><span></span></nobr>\
    		         </a>\
    	        </h3>\
    	        <table id='tblBattleRhythm' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>\
            </div>";

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            strArr.push(item.eventDate.format("HHmm"));
            strArr.push(item.endDate.format("HHmm"));
            strArr.push(item.title);
            strArr.push(item);

            return strArr;
        });

        container.append($(html));

        $("#tblBattleRhythm").dataTable({
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            data: dtSource,
            columns: columns,
            columnDefs: [timeagoColumDef]
        });

        $("#tblBattleRhythm abbr.timeago").timeago();
    }

    function renderCCIRTable(container, data) {
        //DataTables configurations
        var columns = [
            { title: "Category" },
            { title: "Requirement", width: "1%" },
            { title: "Status", width: "1%" },
            { title: "Title" }
        ];

        var kpiColumDef = {
            render: function (data, type, row) {
                /*
                /_layouts/images
                /_layouts/15/images
                kpinormallarge-0.gif maps to green
                kpinormallarge-1.gif maps to yellow
                kpinormallarge-2.gif maps to red
                */

                if (data === "Green") {
                    return '<i style="color:green;" class="fa fa-circle fa-2x"></i> ';
                } else if (data === "Yellow") {
                    return '<i style="color:yellow;" class="fa fa-circle fa-2x"></i> ';
                } else if (data === "Red") {
                    return '<i style="color:red;" class="fa fa-circle fa-2x"></i> ';
                }

            },
            targets: 2
        };

        //Template
        var html =
            "<div class='appPart'>\
                <h3 style='text-align:justify;' class='ms-standardheader ms-WPTitle'>\
    		        <a href='"+ requirejs.spWebURL + "/Lists/CCIR'>\
    		            <nobr><span>CCIR</span><span></span></nobr>\
    		         </a>\
    	        </h3>\
    	        <table id='tblCCIR' cellpadding='0' cellspacing='0' border='0' class='hover row-border' width='100%'></table>\
            </div>";

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            var req = item.category.charAt(0) + item.number;
            strArr.push(item.category);
            strArr.push(req);
            strArr.push(item.status);
            strArr.push(item.title);

            return strArr;
        });

        container.append($(html));

        $("#tblCCIR").dataTable({
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            data: dtSource,
            columns: columns,
            columnDefs: [kpiColumDef]
        })
        .rowGrouping({ bExpandableGrouping: true });
    }

    function renderMessageTrafficTable(container, data, headingName, tableID) {
        //DataTables configurations
        var columns = [
            { title: "DateTimeGroup(hidden for sorting purposes)", visible: false },
            { title: "DTG//ORG//TITLE" },
            { title: "Task/Info" },
            { title: "Initials", width: "1%" }
        ];

        //Template
        var html =
            "<div class='appPart'>\
                <h3 style='text-align:justify;' class='ms-standardheader ms-WPTitle'>\
    		        <a href='"+ requirejs.spWebURL + "/Lists/MessageTraffic'>\
    		            <nobr><span>"+ headingName + "</span><span></span></nobr>\
    		         </a>\
    	        </h3>\
    	        <table id='"+ tableID + "' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>\
            </div>";

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            strArr.push(item.dateTimeGroup);
            strArr.push(item.dtgOrgTitle);
            strArr.push(item.taskInfo);
            strArr.push(item.initials);

            return strArr;
        });

        container.append($(html));

        $("#" + tableID).dataTable({
            paging: true,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [
                { "iDataSort": 0, "aTargets": [1] } //when sorting the second column, rely on value in first column instead
            ]
        });
    }

    function renderMissionTrackerTable(container, data) {
        //DataTables configurations
        var columns = [
            { title: "Status" }, //GROUPBY COL
            { title: "Mission#" },
            { title: "Title" },
            { title: "Expected Execution", width: "1%" },
            { title: "Expected Termination", width: "1%" },
            { title: "Comments" }
        ];

        //Template
        var html =
            "<div class='appPart'>\
                <h3 style='text-align:justify;' class='ms-standardheader ms-WPTitle'>\
    		        <a href='"+ requirejs.spWebURL + "/Lists/MissionTracker'>\
    		            <nobr><span>Mission Tracker</span><span></span></nobr>\
    		         </a>\
    	        </h3>\
    	        <table id='tblMissionTracker' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>\
            </div>";

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            var execution = item.expectedExecution.isValid() ?
                item.expectedExecution.format("M/D/YYYY") : "";

            var termination = item.expectedTermination.isValid() ?
                item.expectedTermination.format("M/D/YYYY") : "";

            strArr.push(item.status);
            strArr.push(item.missionNumber);
            strArr.push(item.title);
            strArr.push(execution);
            strArr.push(termination);
            strArr.push(item.comments);
            return strArr;
        });

        container.append($(html));

        $("#tblMissionTracker").dataTable({
            paging: false,
            info: false,
            searching: false,
            ordering: true,
            data: dtSource,
            columns: columns
        })
        .rowGrouping({ bExpandableGrouping: true });
    }

    function renderRfiTable(container, data) {
        //DataTables configurations
        var columns = [
            { title: "POC Organization" },
            { title: "RFI Tracking", width: "1%" },
            { title: "Title" },
            { title: "LTIOV" },
            { title: "Priority" },
            { title: "Date Opened" }
        ];

        //Template
        var html =
            "<div class='appPart'>\
                <h3 style='text-align:justify;' class='ms-standardheader ms-WPTitle'>\
    		        <a href='"+ requirejs.spWebURL + "/Lists/Rfi'>\
    		            <nobr><span>Open Collection Requirements</span><span></span></nobr>\
    		         </a>\
    	        </h3>\
    	        <table id='tblRfi' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>\
            </div>";

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            var ltiov = (item.ltiov.isValid()) ? item.ltiov.format("M/D/YYYY H:mm A") : "",
                dateOpened = (item.dateOpened.isValid()) ? item.dateOpened.format("M/D/YYYY H:mm A") : "";

            strArr.push(item.pocOrganization);
            strArr.push(item.rfiTracking);
            strArr.push(item.title);
            strArr.push(ltiov);
            strArr.push(item.priority);
            strArr.push(dateOpened);

            return strArr;
        });

        container.append($(html));

        $("#tblRfi").dataTable({
            paging: true,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns
        });
    }

    function renderWatchlogTable(container, data) {
        //DataTables configurations
        var columns = [
            { title: "DateTimeGroup(hidden for sorting purposes)", visible: false },
            { title: "DTG", width: "1%" },
            { title: "Organization" },
            { title: "Event" },
            { title: "Action Taken" },
            { title: "Initials", width: "1%" }
        ];

        //Template
        var html =
            "<div class='appPart'>\
                <h3 style='text-align:justify;' class='ms-standardheader ms-WPTitle'>\
    		        <a href='"+ requirejs.spWebURL + "/Lists/WatchLogSocc'>\
    		            <nobr><span>Watch Log</span><span></span></nobr>\
    		         </a>\
    	        </h3>\
    	        <table id='tblWatchLog' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>\
            </div>";

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            strArr.push(item.dateTimeGroup);
            strArr.push(item.dtg);
            strArr.push(item.organization);
            strArr.push(item.title);
            strArr.push(item.actionTaken);
            strArr.push(item.initials);

            return strArr;
        });

        container.append($(html));

        $("#tblWatchLog").dataTable({
            paging: true,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [
                { "iDataSort": 0, "aTargets": [1] } //when sorting the second column, rely on value in first column instead
            ]
        });
    }

    return exposedAPI;
});
