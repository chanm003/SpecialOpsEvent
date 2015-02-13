<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>Mission Tracker
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">Mission Tracker
	
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
                    <a id="lnkAddNew" class="ms-addnew" >Add a new Mission</a>
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
                        <li><a href="#tabs-1">Timeline</a></li>
                        <li><a href="#tabs-2">Missions</a></li>
                        <li><a href="#tabs-3">Documents</a></li>
                        <li><a href="#tabs-4">CONOP Chop</a></li>
                    </ul>
                    <div id="tabs-1">
                        <div id="ganttChart"></div>
                    </div>
                    <div id="tabs-2">
       
                            <table id='tblMissionTracker' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>
                           
                    </div>
                    <div id="tabs-3">
                            <table id='tblMissionDocuments' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>

                    </div>
                    <div id="tabs-4">
                            <table id='tblConopChops' cellpadding='0' cellspacing='0' border='0' class='hover cell-border' width='100%'></table>

                    </div>
                </div>




            </td>
        </tr>
    </table>

    <!--  NOT USING OOTB LISTVIEW WEB PART (TYPE=GANTT)
    <div id="ganttViewWebpart" style="margin-top: 5000px">
        <WebPartPages:WebPartZone runat="server" FrameType="None" ID="timeline" Title="loc:timeline"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone> 
    </div>
    -->
<!--HIDDEN MODAL START-->
<link rel="stylesheet" type="text/css" href="/_layouts/1033/styles/Themable/forms.css"/>
<div id="chopForm" style="display:none;">
	<span><b>CONOP Chop Form</b></span>
	<table class="ms-formtable" style="margin-top: 8px;" border="0" cellpadding="0" cellspacing="0" width="100%">	
		<tbody>
			<tr>
				<td nowrap="true" valign="top" width="190px" class="ms-formlabel">
					<h3 class="ms-standardheader">
						<nobr>Details</nobr>
					</h3>
				</td>
				<td valign="top" class="ms-formbody">
					<p>
						<b>{{conop.fileName}}</b>
					</p>
					<p>
						Mission: {{conop.missionName}}
					</p>
					<p>
						Organization: {{conop.organization}}
					</p>
					<p>
						Overall Chop Status: {{conop.overallChopStatus}} 
					</p>
				</td>
			</tr>	
			<tr>
				<td nowrap="true" valign="top" width="190px" class="ms-formlabel">
					<h3 class="ms-standardheader">
						<nobr>{{reviewer}} Chop Status</nobr>
					</h3>
				</td>
				<td valign="top" class="ms-formbody">
					<span dir="none">
						<select class="ms-RadioText reviewerChopStatus">
							<option selected="selected" value=""></option>
							<option value="Approved">Approved</option>
							<option value="Disapproved">Disapproved</option>
						</select>
					</span>
				</td>
			</tr>
			<tr>
				<td nowrap="true" valign="top" width="190px" class="ms-formlabel">
					<h3 class="ms-standardheader">
						<nobr>Comments</nobr>
					</h3>
				</td>
				<td valign="top" class="ms-formbody">
					<span dir="none">
						<textarea rows="6" cols="30" dir="none" class="reviewerComments"></textarea>
					</span>		
				</td>
			</tr>
		</tbody>
	</table>
	<table cellpadding="0" cellspacing="0" width="100%">
		<tbody>
			<tr>
				<td class="ms-formline">
					<img src="/_layouts/images/blank.gif" width="1" height="1" alt=""/>
				</td>
			</tr>
		</tbody>
	</table>
	<div style="text-align:right;">
		<input type="hidden" value="{{conop.id}}" class="conopID"/>
		<input type="hidden" value="{{conop.libraryForDocument}}" class="libraryForConop"/>
		<input type="hidden" value="{{reviewer}}" class="reviewer"/>
		<input type="button" accesskey="O" class="ms-ButtonHeightWidth btnSave" value="Save" />
	</div>
</div>
<!--HIDDEN MODAL END-->
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PlaceHolderUtilityContent" runat="server">
	<SharePoint:ScriptLink ID="ScriptLink1" language="javascript"
    name="~site/app/js/lib/require.js"
    runat="server"/>
    <script type="text/javascript">

        ExecuteOrDelayUntilScriptLoaded(function () {
            require(['js/common'], function (common) {
                require(['app/datacontext', 'app/missionTracker'], function (datacontext, UI) {
                    var lnkAddNewUrl = '../Lists/MissionTracker/NewForm.aspx?Source=' + _spPageContextInfo.webServerRelativeUrl + "/app/MissionTracker.aspx";
                    $("#lnkAddNew").attr("href", lnkAddNewUrl);

                    $.when(
                       datacontext.getConopChops(),
                       datacontext.getMissionDocuments("EXCON Documents"),
                       datacontext.getMissionDocuments("SOATG Documents"),
                       datacontext.getMissionDocuments("SOCC Documents"),
                       datacontext.getMissionDocuments("SOTG-15 Documents"),
                       datacontext.getMissionDocuments("SOTG-25 Documents"),
                       datacontext.getMissionDocuments("SOTG-35 Documents"),
                       datacontext.getMissions()
                       )
                       .then(function (conopChops, exconDocs, SOATGDocs, soccDocs, sotg15Docs, sotg25Docs, sotg35Docs, missionItems) {

                           var missionDocs = [];
                           missionDocs = missionDocs.concat(exconDocs);
                           missionDocs = missionDocs.concat(SOATGDocs);
                           missionDocs = missionDocs.concat(soccDocs);
                           missionDocs = missionDocs.concat(sotg15Docs);
                           missionDocs = missionDocs.concat(sotg25Docs);
                           missionDocs = missionDocs.concat(sotg35Docs);



                           UI.render({
                               conopChops: conopChops,
                               missionData: missionItems,
                               missionDocs: missionDocs
                           });


                       });


                });
            });

        }, "sp.js");

    </script>
</asp:Content>



