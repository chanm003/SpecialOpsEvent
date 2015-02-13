define(function (require) {

    //dependencies
    var $ = require('jquery'),
    	jqueryui = require('jqueryui');

    var tabsPanel = $("#tabs"),
		firstTab = $("#tabs-1");

    function addAttributeToTableRows() {
        $("nobr").each(function () {
            var lblField = $(this),
   				spFieldDisplayName = lblField.text(),
   				parentTableRow = lblField.closest("tr");

            parentTableRow.attr("sp-field-display-name", spFieldDisplayName);
        });
    }

    function listenForAttachButtonClick() {
        $("[id='Ribbon.ListForm.Edit.Actions.AttachFile-Large']").click(function () {
            //user clicked on 'Attach File' in the ribbon
            //so redirect them to first tab and disable second and third tabs  
            tabsPanel.tabs({ active: 0 });
            tabsPanel.tabs({ disabled: [1, 2] });
        });

        $(".ms-attachUploadButtons input[type=button]").click(function () {
            //user clicked 'Ok' or 'Cancel' after attaching some files
            //endable all tabs
            tabsPanel.tabs("enable");
        });
    }

    function moveContentToOtherTabs() {
        var tblAirborneOps = $("#tblAirborneOps"),
   			tblCargo = $("#tblCargo");

        $("[sp-field-display-name^=ABN]").each(function () {
            tblAirborneOps.append($(this));
        });

        $("[sp-field-display-name^=Cargo]").each(function () {
            tblCargo.append($(this));
        });

    }

    function moveToolbar() {
        tabsPanel.before($(".ms-formtoolbar:last", firstTab));
    }

    function render() {
        addAttributeToTableRows();
        moveToolbar();
        moveContentToOtherTabs();
        listenForAttachButtonClick();
        tabsPanel.tabs();
        $("#onetIDListForm").show();
    }

    return {
        render: render
    };
});