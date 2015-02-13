<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>Air Support Requests
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">Air Support Request
	
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
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody>
            <tr>
                <td colspan="2" class="ms-partline"><img src="/_layouts/images/blank.gif" width="1" height="1" alt=""></td>
            </tr>
            <tr>
                <td class="ms-addnew" style="padding-bottom: 3px">
                    <span style="height:10px;width:10px;position:relative;display:inline-block;overflow:hidden;" class="s4-clust"><img src="/_layouts/images/fgimg.png" alt="" style="left:-0px !important;top:-128px !important;position:absolute;"></span>&nbsp;
                    <a id="lnkAddNew" class="ms-addnew" >Add a new Air Support Request</a>
                </td>
            </tr>
            <tr>
                <td><img src="/_layouts/images/blank.gif" width="1" height="5" alt=""></td>
            </tr>
        </tbody>
    </table>
	<table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding:5px 10px 10px 10px;">
        <tr>
            <td valign="top">
                <div id="tabs">
                    <ul style="display:none;">
                        <li><a href="#tabs-1">All Items</a></li>
                        <li><a href="#tabs-2">Timeline</a></li>
                    </ul>
                    <div id="tabs-1">
                        <table id='tblMissionTracker' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>
                    </div>
                    <div id="tabs-2">
                        
                        <div id="ganttChart"></div>
                           
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
                require(['app/datacontext', 'app/asr'], function (datacontext, UI) {
                    var lnkAddNewUrl = '../Lists/AirSupportRequests/NewForm.aspx?Source=' + _spPageContextInfo.webServerRelativeUrl + "/app/asr.aspx";
                    $("#lnkAddNew").attr("href", lnkAddNewUrl);

                    $.when(
                       datacontext.getAirSupportRequests()
                       )
                       .then(function (asrItems) {

                           UI.render(asrItems);


                       });


                });
            });

        }, "sp.js");

    </script>
</asp:Content>



