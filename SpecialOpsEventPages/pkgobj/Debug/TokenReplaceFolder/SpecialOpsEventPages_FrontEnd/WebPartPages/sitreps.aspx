<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>SITREPs
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">SITREPs
	
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
              

                <table id='tblMissionDocuments' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>




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
                require(['app/datacontext', 'app/sitreps'], function (datacontext, UI) {


                    $.when(
                       datacontext.getMissionDocumentsByType("EXCON Documents", "SITREPS Situational Reports"),
                       datacontext.getMissionDocumentsByType("SOATG Documents", "SITREPS Situational Reports"),
                       datacontext.getMissionDocumentsByType("SOCC Documents", "SITREPS Situational Reports"),
                       datacontext.getMissionDocumentsByType("SOTG-15 Documents", "SITREPS Situational Reports"),
                       datacontext.getMissionDocumentsByType("SOTG-25 Documents", "SITREPS Situational Reports"),
                       datacontext.getMissionDocumentsByType("SOTG-35 Documents", "SITREPS Situational Reports")
                       )
                       .then(function (exconDocs, soatgDocs, soccDocs, sotg15Docs, sotg25Docs, sotg35Docs) {

                           var missionDocs = [];
                           missionDocs = missionDocs.concat(exconDocs);
                           missionDocs = missionDocs.concat(soatgDocs);
                           missionDocs = missionDocs.concat(soccDocs);
                           missionDocs = missionDocs.concat(sotg15Docs);
                           missionDocs = missionDocs.concat(sotg25Docs);
                           missionDocs = missionDocs.concat(sotg35Docs);



                           UI.render(missionDocs);


                       });


                });
            });

        }, "sp.js");

    </script>
</asp:Content>



