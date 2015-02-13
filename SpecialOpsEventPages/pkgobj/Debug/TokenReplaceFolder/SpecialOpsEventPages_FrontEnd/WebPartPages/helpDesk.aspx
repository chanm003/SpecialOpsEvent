<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>Help Desk
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">Help Desk
	
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <style type="text/css">
        #s4-leftpanel, #sideNavBox {
            display: none;
        }

        .s4-ca{
            margin-left: 0px;
        }

        #contentBox {
            margin-left: 40px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="PlaceHolderMain" runat="server">
	<table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding:5px 10px 10px 10px;">
        <tr>
            <td valign="top">
              

                <div id="tabs">
                    <ul style="display:none;">
                        <li><a href="#tabs-1">Open - Help Desk</a></li>
                        <li><a href="#tabs-2">Open - Portal/KM</a></li>
                        <li><a href="#tabs-3">Hold</a></li>
                        <li><a href="#tabs-4">Resolved</a></li>
                        <li><a href="#tabs-5">My Requests</a></li>
                    </ul>
                    <div id="tabs-1">
                          <table id='tblHelpDesk' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>
                    </div>
                    <div id="tabs-2">
       
                            <table id='tblPortalKM' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>
                           
                    </div>
                    <div id="tabs-3">
                             <table id='tblHold' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>

                    </div>
                    <div id="tabs-4">
                            <table id='tblResolved' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>
                            

                    </div>
                     <div id="tabs-5">
                            <table id='tblMyTickets' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>

                    </div>
                </div>




            </td>
        </tr>
    </table>

   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PlaceHolderUtilityContent" runat="server">
	<SharePoint:ScriptLink ID="ScriptLink1" language="javascript"
    name="~site/app/js/lib/require.js"
    runat="server"/>
    <script type="text/javascript">

        ExecuteOrDelayUntilScriptLoaded(function () {
            require(['js/common'], function (common) {
                require(['app/datacontext', 'app/helpDesk'], function (datacontext, UI) {


                    $.when(
                       datacontext.getHelpDeskTickets()
                       )
                       .then(function (helpDeskTickets) {
                           UI.render(helpDeskTickets);
                       });


                });
            });

        }, "sp.js");

    </script>
</asp:Content>



