define(function (require) {

    //dependencies
    var $ = require('jquery'),
        jqueryui = require('jqueryui'),
        commonUI = require('app/commonUI'),
        datatables = require('datatablesGrouped'),
        handlebars = require('handlebars'),
        moment = require('moment'),
        queryString = require('queryString'),
        timeago = require('timeago'),
        underscore = require('underscore');



    var exposedAPI = {
        render: render
    }


    function render(data) {
        renderMissionDocumentsTable(data);
    }


    function renderMissionDocumentsTable(data) {
        //DataTables configurations
        var columns = [
            { title: "Organization" }, //GROUPBY COL,
            { title: "Name" },
            { title: "Modified" },
            { title: "Modified By" }
        ];


        var linkColumDef = {
            render: function (item, type, row) {
                var html = "";

                html = "<a target='_blank' title='View " + item.fileName + "' href='/" + item.fileRef.lookupValue + "'>" + item.fileName + "</a>";

                return html;
            },
            targets: 1
        };

        var userNameColumDef = {
            render: function (editor, type, row) {
                var html = "";

                var url = _spPageContextInfo.webServerRelativeUrl + "/_layouts/userdisp.aspx?ID=" + editor.userId;
                html = "<a title='View Profile for " + editor.userName + "' href='" + url + "'>" + editor.userName + "</a>";

                return html;
            },
            targets: 3
        };

        //sort by organization, so we can later group by organization
        data = _.sortBy(data, function (item) {
            return item.organization;
        });

        var dtSource = _.map(data, function (item, index) {
            var strArr = [];

            strArr.push("Organization: " + item.organization);
            strArr.push(item);
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




    return exposedAPI;
});


