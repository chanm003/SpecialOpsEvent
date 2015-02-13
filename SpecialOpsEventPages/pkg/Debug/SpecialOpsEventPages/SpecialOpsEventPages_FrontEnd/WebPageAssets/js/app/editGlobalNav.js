define(function (require) {
	    
    //dependencies
    var $ = require('jquery'),
    	jstree = require('jstree'),
        underscore = require('underscore');
    
	//DOM
	var btbSave = null,
		editPanel = null,
		ddlSelectedMenuItemVisibility = null,
		lblSelectedMenuItem = null,
		txtSelectedMenuItemUrl = null,
		treeUI = null;
		
	var exposedAPI = {
		init: init
	}
				
	function disableCutCopyPaste(node) {
		var tmp = $.jstree.defaults.contextmenu.items();
		delete tmp.ccp;
		return tmp;
	}
	
	function init(menuItems){
		performDomSelection();
		listenToMenuItemEditEvents();
		initTreeViewPlugin(menuItems);
		listenForButtonClicks();
	}
	
	function initTreeViewPlugin(menuItems){
		treeUI
			// create the instance
			.jstree({
			  	core: {
			  		themes : { stripes : true },
					data: menuItems,
					check_callback : true	
				},
				plugins : ["contextmenu", "dnd", "search", "state", "types", "wholerow"],
				contextmenu : {
					items : disableCutCopyPaste
				}
			
			})
			// listen for event
			.on('changed.jstree', onItemChanged);
			
	}
	
	function listenForButtonClicks(){
		btnSave.on('click', function(e){
			e.preventDefault();
			$(exposedAPI).trigger("globalNav.saveMenuItemsClicked", {
				menuItemsToSave: treeUI.jstree(true).get_json()
			});
		});

		btnReset.on('click', function (e) {
		    e.preventDefault();
		    $(exposedAPI).trigger("globalNav.resetClicked");
		});
	}
	
	function listenToMenuItemEditEvents(){
		ddlSelectedMenuItemVisibility.change(onMenuItemVisibilityUpdated);
		txtSelectedMenuItemUrl.change(onMenuItemUrlUpdated);
	}
	
	function listenToContextMenuEvents(o, n, p, i, m) {
		if(m && m.dnd && m.pos !== 'i') { return false; }
		if(o === "move_node" || o === "copy_node") {
			if(this.get_node(n).parent === this.get_node(p).id) { return false; }
		}
		return true;
	}
		
	function onItemChanged(e, data) {
		if(data.selected.length !== 1){ return; }
		
		var selectedItem = data.instance.get_node(data.selected[0]);
		
		ddlSelectedMenuItemVisibility.val(selectedItem.li_attr.visibility || "");
		txtSelectedMenuItemUrl.val(selectedItem.li_attr.url || "");
		lblSelectedMenuItem.text(selectedItem.id);
		
		editPanel.show();

	}
	
	function onMenuItemUrlUpdated(){
		var id = lblSelectedMenuItem.text();
		if(id){
			var node = treeUI.jstree().get_node(id);
			node.li_attr["url"] = txtSelectedMenuItemUrl.val();
		}
	}

	function onMenuItemVisibilityUpdated(){
		var id = lblSelectedMenuItem.text();
		if(id){
			var node = treeUI.jstree().get_node(id);
			node.li_attr["visibility"] = ddlSelectedMenuItemVisibility.val();
		}
	}				
	
	function performDomSelection() {
	    btnReset = $("#btnReset");
		btnSave = $("#btnSave");
		editPanel = $("#editPanel");
		treeUI = $('#jstree');
        lblSelectedMenuItem = $("#selectedMenuItem"),
		ddlSelectedMenuItemVisibility = $("#menuItemVisibility"),
		txtSelectedMenuItemUrl = $("#menuItemUrl");
	}
	
	
	return exposedAPI;    
});
