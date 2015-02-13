define(function (require) {

    //dependencies
    var $ = require('jquery'),
        jqueryui = require('jqueryui'),
        commonUI = require('app/commonUI'),
        datatables = require('datatablesGrouped'),
        moment = require('moment'),
        timeago = require('timeago'),
        underscore = require('underscore');

    var exposedAPI = {
        render: render
    }

    function render(allTickets) {
        //help desk open tickets
        var openHelpDeskTickets = _.filter(allTickets, function (ticket) {
            return ticket.requestType !== 'Portal Development/KM' &&
                (ticket.status === "Initiated" || ticket.status === "Engaged");
        });
        renderOpenTicketsTable(openHelpDeskTickets, "#tblHelpDesk");

        //portal/km open tickets
        var openPortalKMTickets = _.filter(allTickets, function (ticket) {
            return ticket.requestType === 'Portal Development/KM' &&
                (ticket.status === "Initiated" || ticket.status === "Engaged");
        });
        renderOpenTicketsTable(openPortalKMTickets, "#tblPortalKM");

        //on-hold tickets
        var onHoldTickets = _.filter(allTickets, function (ticket) {
            return ticket.status === "Hold";
        });
        renderOnHoldTicketsTable(onHoldTickets);

        //resolved tickets
        var resolvedTickets = _.filter(allTickets, function (ticket) {
            return ticket.status === "Resolved";
        });
        renderResolvedTicketsTable(resolvedTickets);

        //tickets created by current user
        var myTickets = _.filter(allTickets, function (ticket) {
            //deliberarately performing double equals here, one side is a string the other side is an int
            return ticket.author.userId == _spPageContextInfo.userId;
        });
        renderMyTicketsTable(myTickets);
        
        renderTabs();
        
    }

    function generateHtmlForSpUser(user, type, row) {
        var html = "";

        var url = _spPageContextInfo.webServerRelativeUrl + "/_layouts/userdisp.aspx?ID=" + user.userId;
        html = "<a title='View Profile for " + user.userName + "' href='" + url + "'>" + user.userName + "</a>";

        return html;
    }

    var dataTableColumnDefinitions = {
        linkColumnDef: {
            render: function (item, type, row) {
                var html = "";

                html = "<a title='Details: " + item.title + "' class='showSharePointModal' href='" + item.dispFormUrl + "&IsDlg=1'>" + item.title + "</a>";

                return html;
            }
        },
        userNameColumnDef: {
            render: generateHtmlForSpUser
        },
        userNameColumnDefMulti: {
            render: function (users, type, row) {
                var html = "";

                var hyperLinks = _.map(users, function (user) {
                    return generateHtmlForSpUser(user, type, row);
                });

                if (hyperLinks.length) {
                    html = hyperLinks.join('; ');
                }

                return html;
            }
        }
    };

    function renderMyTicketsTable(data) {
        //DataTables configurations
        var columns = [
            { title: "Title" },
            { title: "Priority" },
            { title: "Customer" },
            { title: "Assigned To" },
            { title: "Status" },
            { title: "Resolution Type" },
            { title: "Resolution Date" },
            { title: "Created" },
            { title: "Created By" }
        ];

        var linkColumDef = $.extend({}, dataTableColumnDefinitions.linkColumnDef, { targets: 0 });
        var userNameColumDef = $.extend({}, dataTableColumnDefinitions.userNameColumnDef, { targets: [2, 8] });
        var userNameColumDefMulti = $.extend({}, dataTableColumnDefinitions.userNameColumnDefMulti, { targets: 3 });


        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            var resolution = item.resolutionDate.isValid() ?
                item.resolutionDate.format("M/D/YYYY") : "";

            strArr.push(item);
            strArr.push(item.priority);
            strArr.push(item.customer);
            strArr.push(item.assignedTo);
            strArr.push(item.status);
            strArr.push(item.resolutionType);
            strArr.push(resolution);
            strArr.push(item.created.format("M/D/YYYY H:mm A"));
            strArr.push(item.author);
            return strArr;
        });

        var tbl = $("#tblMyTickets");
        tbl.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [linkColumDef, userNameColumDef, userNameColumDefMulti]
        });

        commonUI.addModalBehavior(tbl, ".showSharePointModal");
    }

    function renderOnHoldTicketsTable(data) {
        //DataTables configurations
        var columns = [
            { title: "Request Type" }, //GROUPBY COL
            { title: "Title" },
            { title: "Priority" },
            { title: "Customer" },
            { title: "Assigned To" },
            { title: "Created" },
            { title: "Created By" }
        ];

        var linkColumDef = $.extend({}, dataTableColumnDefinitions.linkColumnDef, { targets: 1 });
        var userNameColumDef = $.extend({}, dataTableColumnDefinitions.userNameColumnDef, { targets: [3, 6] });
        var userNameColumDefMulti = $.extend({}, dataTableColumnDefinitions.userNameColumnDefMulti, { targets: 4 });


        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            //var termination = item.expectedTermination.isValid() ?
            //    (item.expectedTermination.format("DDHHmm") + "Z" + item.expectedTermination.format("MMMYY")).toUpperCase() : "";

            strArr.push("Request Type: " + item.requestType); //GROUPBY COL
            strArr.push(item);
            strArr.push(item.priority);
            strArr.push(item.customer);
            strArr.push(item.assignedTo);
            strArr.push(item.created.format("M/D/YYYY H:mm A"));
            strArr.push(item.author);
            return strArr;
        });

        var tbl = $("#tblHold");
        tbl.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [linkColumDef, userNameColumDef, userNameColumDefMulti]
        })
        .rowGrouping({ bExpandableGrouping: true });

        commonUI.addModalBehavior(tbl, ".showSharePointModal");
    }

    function renderOpenTicketsTable(data, jquerySelectorForTable) {
        //DataTables configurations
        var columns = [
            { title: "Status" }, //GROUPBY COL
            { title: "Title" },
            { title: "Priority" },
            { title: "Customer" },
            { title: "Assigned To" },
            { title: "Created" },
            { title: "Created By" }
        ];

        var linkColumDef = $.extend({}, dataTableColumnDefinitions.linkColumnDef, { targets: 1 });
        var userNameColumDef = $.extend({}, dataTableColumnDefinitions.userNameColumnDef, { targets: [3, 6] });
        var userNameColumDefMulti = $.extend({}, dataTableColumnDefinitions.userNameColumnDefMulti, { targets: 4 });


        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            //var termination = item.expectedTermination.isValid() ?
            //    (item.expectedTermination.format("DDHHmm") + "Z" + item.expectedTermination.format("MMMYY")).toUpperCase() : "";

            strArr.push("Status: " + item.status); //GROUPBY COL
            strArr.push(item);
            strArr.push(item.priority);
            strArr.push(item.customer);
            strArr.push(item.assignedTo);
            strArr.push(item.created.format("M/D/YYYY H:mm A"));
            strArr.push(item.author);
            return strArr;
        });

        var tbl = $(jquerySelectorForTable);
        tbl.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [linkColumDef, userNameColumDef, userNameColumDefMulti]
        })
        .rowGrouping({ bExpandableGrouping: true });

        commonUI.addModalBehavior(tbl, ".showSharePointModal");
    }

    function renderResolvedTicketsTable(data) {
        //DataTables configurations
        var columns = [
            { title: "Request Type" }, //GROUPBY COL
            { title: "Title" },
            { title: "Priority" },
            { title: "Customer" },
            { title: "Assigned To" },
            { title: "Resolution Type" },
            { title: "Resolution Date" },
            { title: "Created" },
            { title: "Created By" }
        ];

        var linkColumDef = $.extend({}, dataTableColumnDefinitions.linkColumnDef, { targets: 1 });
        var userNameColumDef = $.extend({}, dataTableColumnDefinitions.userNameColumnDef, { targets: [3, 8] });
        var userNameColumDefMulti = $.extend({}, dataTableColumnDefinitions.userNameColumnDefMulti, { targets: 4 });


        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            var resolution = item.resolutionDate.isValid() ?
                item.resolutionDate.format("M/D/YYYY") : "";

            strArr.push("Request Type: " + item.requestType); //GROUPBY COL
            strArr.push(item);
            strArr.push(item.priority);
            strArr.push(item.customer);
            strArr.push(item.assignedTo);
            strArr.push(item.resolutionType);
            strArr.push(resolution);
            strArr.push(item.created.format("M/D/YYYY H:mm A"));
            strArr.push(item.author);
            return strArr;
        });

        var tbl = $("#tblResolved");
        tbl.dataTable({
            paging: false,
            info: true,
            searching: true,
            ordering: true,
            data: dtSource,
            columns: columns,
            columnDefs: [linkColumDef, userNameColumDef, userNameColumDefMulti]
        })
        .rowGrouping({ bExpandableGrouping: true });

        commonUI.addModalBehavior(tbl, ".showSharePointModal");
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


    return exposedAPI;
});

