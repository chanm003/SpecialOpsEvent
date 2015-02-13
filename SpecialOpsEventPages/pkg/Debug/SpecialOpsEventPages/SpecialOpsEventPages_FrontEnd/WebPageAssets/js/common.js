//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    baseUrl: requirejs.spWebURL + '/app/js/lib',
    paths: {
        app: requirejs.spWebURL + '/app/js/app',
        datatables: 'datatables/js/jquery.dataTables.min',
        datatablesGrouped: 'datatables/js/jquery.dataTables.rowGrouping',
        dateJS: 'date',
        gantt: 'jqueryGanttView/jquery.ganttView-soceur-custom',
        handlebars: 'handlebars-v2.0.0',
        jquery: 'jquery.min',
        jqueryui: 'jqueryui/jquery-ui.min',
        jstree: 'jstree/jstree.min',
        moment: 'moment.min',
        qtip: 'qtip/jquery.qtip.min',
        queryString: 'query-string',
        spServices: 'jquery.SPServices-2014.01.min',
        timeago: 'jquery.timeago',
        underscore: 'underscore.min',
        vex: 'vex/js/vex.min',
        vexDialog: 'vex/js/vex.dialog.min'
    },
    shim: {
        datatablesGrouped: {
            deps: ['datatables']
        },
        dateJS: {
            deps: ['jquery']
        },
        gantt: {
            deps: ['jqueryui']
        },
        handlebars: {
            exports: "Handlebars"
        },
        jqueryui: {
            deps: ['dateJS','jquery']
        },
        jstree: {
            deps: ['jquery']
        },
        qtip: {
            deps: ['jquery']
        },
        spServices: {
            deps: ['jquery']
        },
        timeago: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        vexDialog: {
            deps: ['jquery', 'vex']
        }
    }
});
