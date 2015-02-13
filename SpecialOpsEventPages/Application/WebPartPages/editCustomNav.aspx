<%@ Page Language="C#" masterpagefile="~masterurl/default.master"  inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document" %>
<%@ Register tagprefix="WebPartPages" namespace="Microsoft.SharePoint.WebPartPages" assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register tagprefix="SharePoint" namespace="Microsoft.SharePoint.WebControls" assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ID="Content1" ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>Edit Navigation
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">Edit Navigation
	
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderId="PlaceHolderAdditionalPageHead">
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
	<asp:ScriptManagerProxy runat="server" id="ScriptManagerProxy">
	</asp:ScriptManagerProxy>
	<table width="100%">
		<tr>
			<td style="width:50%; vertical-align:top;padding-left:15px;">
				<h3>Configuring the Navigation</h3>
                <h5>Warning: Do not try to make updates all at once.  Click on 'Save All Changes' as you work</h5>
				<div id="jstree"></div>
				<br/>
				<br/>
				<button id="btnSave">Save all Changes</button>&nbsp;<button id="btnReset">Reset to Default Menu Items</button>
			</td>
			<td style="width:50%; vertical-align:top;padding-left:65px;">
				<div id="editPanel" style="display:none;">
					<h3>Selected Menu Item</h3>
					<fieldset style="padding:15px 25px;">
						<legend>Properties</legend>
						<label>URL:</label><br/>
						<input type="text" id="menuItemUrl" style="width:100%;"/>
						<br/>
						<br/>
						<label>Visibility:</label><br/>
						<select id="menuItemVisibility">
							<option>Anonymous</option>
							<option>Authenticated</option>
							<option>Hidden</option>
						</select>
						<br/>
						<br/>
						<span style="display:none;" id="selectedMenuItem"></span>
					</fieldset>
				</div>
			</td>
		</tr>
	</table>
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderUtilityContent" runat="server">
	<SharePoint:ScriptLink language="javascript"
    name="~site/app/js/lib/require.js"
    runat="server" />
    <script type="text/javascript">
    
		ExecuteOrDelayUntilScriptLoaded(function(){
			
			require(['./js/common'], function (common) {
            require(['app/datacontext', 'app/editGlobalNav'], function(datacontext, globalNav){
            	
	            	$(globalNav).on("globalNav.saveMenuItemsClicked", function(evt, data){
	            		datacontext.saveNavigation(data.menuItemsToSave);
	            	});

	            	$(globalNav).on("globalNav.resetClicked", function (evt, data) {
	            	    datacontext.prepopulateWithDefaultNavMenuItems();
	            	});
	            	
	            	datacontext.getNavigation(true).then(function(menuItems){
	            		globalNav.init(menuItems);
	            	});            	
	            });
	        });
    		 
		}, "sp.js");

    </script>
</asp:Content>