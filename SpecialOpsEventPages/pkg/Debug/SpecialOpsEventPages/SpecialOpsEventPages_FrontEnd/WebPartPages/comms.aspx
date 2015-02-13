<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>Communications Tracker
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">Communications Tracker
	
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
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding:5px 10px 10px 10px;">
        <tr>
            <td colspan="3" valign="top">
                <div id="commsPageMainContent" style="display:none;">
                    <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Left" Title="loc:Left"></WebPartPages:WebPartZone>
                </div>
            </td>
            <td>&nbsp;</td>
        </tr>
    </table>
    
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="PlaceHolderUtilityContent" runat="server">
	<SharePoint:ScriptLink ID="ScriptLink1" language="javascript"
    name="~site/app/js/lib/require.js"
    runat="server"/>
    <script type="text/javascript">

        ExecuteOrDelayUntilScriptLoaded(function () {

            require(['js/common'], function (common) {
                require(['app/datacontext', 'app/comms'], function (datacontext, UI) {

                    $.when(datacontext.getCommStatuses(), datacontext.getNodeStatuses())
                        .then(function (commStatuses, nodeStatuses) {
                            UI.render({
                                commStatusData: commStatuses,
                                nodeStatusData: nodeStatuses
                            });
                        });
                });
            });

        }, "sp.js");

    </script>
</asp:Content>
