<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>SOCC
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">SOCC
	
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
                <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Top" Title="loc:Top">
                </WebPartPages:WebPartZone>
            </td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td valign="top" width="70%">
                <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Left" Title="loc:Left">
                </WebPartPages:WebPartZone>
            </td>
            <td>&nbsp;</td>
            <td valign="top" width="30%">
                <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Right" Title="loc:Right">
                </WebPartPages:WebPartZone>
            </td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td colspan="3" valign="top">
                <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="Bottom" Title="loc:Bottom">
                </WebPartPages:WebPartZone>
            </td>
            <td>&nbsp;</td>
        </tr>
    </table>
</asp:Content>

