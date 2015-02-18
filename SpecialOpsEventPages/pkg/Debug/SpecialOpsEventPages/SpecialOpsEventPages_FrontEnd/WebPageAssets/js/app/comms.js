define(function (require) {

    //dependencies
    var $ = require('jquery'),
        commonUI = require('app/commonUI'),
    	commsTables = require('app/commsTables');
    
    var exposedAPI = {
        render: render
    }

    function render(data) {
        var container = $('<div class="webpartsContainer">');

        commonUI.renderWebPartHeaderTag(container, "/Lists/CommunicationsStatus/EditableGrid.aspx", "Overall Communication Status");
        commsTables.renderCommsTable(container, data.commStatusData, "/Lists/CommunicationsStatus/EditableGrid.aspx");

        commonUI.renderWebPartHeaderTag(container, "/Lists/NodeStatus/EditableGrid.aspx", "Node Status");
        commsTables.renderNodeStatusTable(container, data.nodeStatusData, "/Lists/NodeStatus/EditableGrid.aspx");

        $("#commsPageMainContent").prepend(container).show();
    }



    return exposedAPI;
});
