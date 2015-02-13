define(function (require) {
	    
    //dependencies
    var $ = require('jquery'),
        _ = require('underscore'),
        commonUI = require('app/commonUI'),
        datacontext = require('app/datacontext'),
        isCurrentUserAuthenticated = !!_spPageContextInfo.userId,
        strTopLevelNodes = [];

	
    function buildMenuItem(node, isTopLevel) {
        var $elm, // $elm will either a <span> or <a> tag
            href = node.li_attr && node.li_attr.url;

        if (href !== "") {
            // clickable menu item
            var isAbsoluteUrl = !href || href.indexOf("http") > -1;
            href = (isAbsoluteUrl) ? href : _spPageContextInfo.webServerRelativeUrl + "/" + href;
            $elm = $('<a class="menu-item"></a>');
            $elm.attr('href', href);
        } else {
            // non-clickable menu item
            $elm = $('<span class="menu-item"></span>');
        }

        $elm.addClass(isTopLevel ? 'static' : 'dynamic');
        $elm.append('<span class="additional-background"><span class="menu-item-text">' + node.text + '</span></span>');

        return $elm;
    }

    function configureFullScreenToggleBehaviorForSP2010() {
        if (!commonUI.isSP2010()) { return; }

	    var leftPanel = $("#s4-leftpanel"),
            mainContentPanel = leftPanel.next("div");

	    addImageToDom();

	    function addImageToDom() {
	        moveBreadcrumb();

	        var $img = $('<img id="tnToggleNav" />');
	        $img.attr('title', 'Toggle Navigation');
	        $img.attr('alt', 'Toggle Navigation');
	        $img.attr('src', requirejs.spWebURL + '/app/images/ArrowExpand.gif');
	        $img.css('cursor', 'pointer');
	        $img.css('position', 'absolute');
	        $img.css('top', '2px');
	        $img.css('left', '2px');
	        $img.on("click", toggleNav);
	        mainContentPanel.prepend($img);

	        function moveBreadcrumb() {
	            $('.ms-pagebreadcrumb').css('padding-left', '15px');
	        }

	        var titleRowVisiblePriorToGoingFullScreen = false;
	        var leftPanelDeliberatelyHidden = leftPanel.is(":hidden");

	        function toggleNav() {
	            var isNotFullScreen = ($img.attr("src").indexOf("ArrowExpand.gif") >= 0),
	                titleRow = $('#s4-titlerow'),
	                ribbonRow = $('#s4-ribbonrow');
	              
	            if (titleRow.is(":visible") && isNotFullScreen) {
	                titleRow.hide();
	                titleRowVisiblePriorToGoingFullScreen = true;
	            }

	            if (!isNotFullScreen && titleRowVisiblePriorToGoingFullScreen) {
	                titleRow.show();
	                titleRowVisiblePriorToGoingFullScreen = false;
	            }

	            leftPanel.css('display', (isNotFullScreen || leftPanelDeliberatelyHidden ? 'none' : ''));
	            ribbonRow.css('display', (isNotFullScreen ? 'none' : ''));
                
	            var imgUrl = isNotFullScreen ? requirejs.spWebURL + '/app/images/ArrowCollapse.gif': requirejs.spWebURL + '/app/images/ArrowExpand.gif';
	            var leftMargin = (isNotFullScreen || leftPanelDeliberatelyHidden) ? '0px' : leftPanel.width();
	            $img.attr('src', imgUrl);
	            mainContentPanel.css('margin-left', leftMargin);
	        }
	    }
	}

	function createChildUL(nodes, parentLI, isTopLevel){
		if(!nodes || !nodes.length){
			//base case
			return;
		}
		
		var $childUl = $('<ul>');
		$childUl.addClass((isTopLevel) ? 'static' : 'dynamic');
		
		_.each(nodes, function (node) {
		    var shouldDisplay = (node.li_attr.visibility === "Anonymous" ||
                (node.li_attr.visibility === "Authenticated" && isCurrentUserAuthenticated) ||
                !node.li_attr.visibility);

            //console.log(node.text + ', should display: ' + shouldDisplay );

		    if (shouldDisplay) {
		        var $li = $('<li></li>');
		        var $elm = buildMenuItem(node, isTopLevel);
		        $li.addClass((isTopLevel) ? 'static' : 'dynamic');

		        if (node.children.length > 0) {
		            $li.addClass('dynamic-children');
		            $elm.addClass('dynamic-children');
		        }

		        $li.append($elm);

		        //call itself
		        createChildUL(node.children, $li, false);
		        $childUl.append($li);
		    }
		});
		
		parentLI.append($childUl);

		
	}	

	function replaceSP2010GlobalNav() {
	    if (!commonUI.isSP2010()) { return; }

	    datacontext.getNavigation().then(function (data) {
	        // Clear out the SP2010 GLOBAL NAV
            // SP2013 does NOT use <div class='menu-horizontal'></div>
	        // Instead SP2013 uses <div class='noindex ms-core-listMenu-horizontalBox'><ul class="root ms-core-listMenu-root static"><li class="static"></li></ul>
	        var sp2010TopNavContainer = $('.menu-horizontal');
	        sp2010TopNavContainer.empty();
	
			// Re-create the outer shell from scratch as SP2010 would
			var $outerUL = $('<ul class="root static"></ul>');
			var $outerLI = $('<li class="static"></li>');

			var rootNode = data[0];
		
			if (rootNode.children) { 
			    //items that are visible without hovering
			    strTopLevelNodes = _.pluck(rootNode.children, "text");
	
                //append items to this <LI> by recursing through data source
			    createChildUL(rootNode.children, $outerLI, true);
			
			    //DOM is built-out so pass it to SP2010 for rendering
			    //SP.UI.AspMenu still exists in SP2013
			    $outerUL.append($outerLI);
			    sp2010TopNavContainer.append($outerUL);
			    $create(SP.UI.AspMenu,null,null,null,$get(sp2010TopNavContainer.parent().attr('id')));
			
			    // SP2013 does NOT use <div class="s4-toplinks"></div> 
			    $('.s4-toplinks').show();
			}
		});
	}	
	
	function defineCustomActionsForRFIList() {
	    window.customRfiActions = {
	        openRfiResponseModal: function (itemId, listUrl) {
	            var modalUrl = listUrl + '/Respond.aspx?ID=' + itemId;
	            SP.UI.ModalDialog.showModalDialog({
	                url: modalUrl,
	                title: 'Respond to RFI'
	            });
	        },
	        openRfiInsufficientModal: function (itemId, listUrl) {
	            var modalUrl = listUrl + '/sufficient.aspx?ID=' + itemId;
	            SP.UI.ModalDialog.showModalDialog({
	                url: modalUrl,
	                title: 'Reopen RFI'
	            });
	        }
	    };



	}

	function defineCustomActionsForMselList() {
	    window.customMselActions = {
	        injectInboundMessage: function (itemId, listUrl) {
	            datacontext.copyMessageTrafficIntoMsel(itemId)
                	.then(function () {
                	    commonUI.showSuccessNotification("MSEL copied to the 'Message Traffic' list", "Please refresh page to see any changes");
                	})
                	.fail(function (err) {
                	    commonUI.showErrorNotification("Error", err.statusText);
                	});
	        }
	    };


	}

	function addCustomContextMenus() {
	    window.Custom_AddListMenuItems = function (m, ctx) {
	        if (ctx.listTemplate === "10015") {
	            //ListDefinition for RFI used "10015"
	            var status = datacontext.getStatusForRFI_Synch(currentItemID);
	            if (status === "Open") {
	                // allow users to respond  
	                CAMOpt(m, 'Respond to this RFI', 'javascript:customRfiActions.openRfiResponseModal("' + currentItemID + '","' + ctx.listUrlDir + '");');
	            } else if (status === "Closed") {
	                // allow users to reopen 
	                CAMOpt(m, 'Reopen this RFI', 'javascript:customRfiActions.openRfiInsufficientModal("' + currentItemID + '","' + ctx.listUrlDir + '");');
	            }
	        }

	        if (ctx.listTemplate === "10011") {
	            //ListDefinition for MSEL used "10011"
	            CAMOpt(m, 'Inject as Inbound Message', 'javascript:customMselActions.injectInboundMessage("' + currentItemID + '","' + ctx.listUrlDir + '");');
	        }

	        return false; //end function
	    }
	}

	function defineCustomActionsForRFIList() {
	    window.customRfiActions = {
	        openRfiResponseModal: function (itemId, listUrl) {
	            var modalUrl = listUrl + '/Respond.aspx?ID=' + itemId;
	            SP.UI.ModalDialog.showModalDialog({
	                url: modalUrl,
	                title: 'Respond to RFI'
	            });
	        },
	        openRfiInsufficientModal: function (itemId, listUrl) {
	            var modalUrl = listUrl + '/sufficient.aspx?ID=' + itemId;
	            SP.UI.ModalDialog.showModalDialog({
	                url: modalUrl,
	                title: 'Reopen RFI'
	            });
	        }
	    };



	}

	function defineCustomActionsForMselList() {
	    window.customMselActions = {
	        injectInboundMessage: function (itemId, listUrl) {
	            datacontext.copyMessageTrafficIntoMsel(itemId)
                	.then(function () {
                	    commonUI.showSuccessNotification("MSEL copied to the 'Message Traffic' list", "Please refresh page to see any changes");
                	})
                	.fail(function (err) {
                	    commonUI.showErrorNotification("Error", err.statusText);
                	});
	        }
	    };


	}

	function addCustomContextMenus() {
	    window.Custom_AddListMenuItems = function (m, ctx) {
	        if (ctx.listTemplate === "10015") {
	            //ListDefinition for RFI used "10015"
	            var status = datacontext.getStatusForRFI_Synch(currentItemID);
	            if (status === "Open") {
	                // allow users to respond  
	                CAMOpt(m, 'Respond to this RFI', 'javascript:customRfiActions.openRfiResponseModal("' + currentItemID + '","' + ctx.listUrlDir + '");');
	            } else if (status === "Closed") {
	                // allow users to reopen 
	                CAMOpt(m, 'Reopen this RFI', 'javascript:customRfiActions.openRfiInsufficientModal("' + currentItemID + '","' + ctx.listUrlDir + '");');
	            }
	        }

	        if (ctx.listTemplate === "10009") {
	            //ListDefinition for MSEL used "10009"
	            CAMOpt(m, 'Inject as Inbound Message', 'javascript:customMselActions.injectInboundMessage("' + currentItemID + '","' + ctx.listUrlDir + '");');
	        }

	        return false; //end function
	    }
	}

	function defineCustomActions() {
	    defineCustomActionsForRFIList();
	    defineCustomActionsForMselList();
	    addCustomContextMenus();
	}

	defineCustomActions();

	//public API    
	return {
	    configureFullScreenToggleBehaviorForSP2010: configureFullScreenToggleBehaviorForSP2010,
	    replaceSP2010GlobalNav: replaceSP2010GlobalNav
	}    
});


