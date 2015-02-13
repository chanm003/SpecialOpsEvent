<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ Page language="C#" inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
<head>
<link rel="stylesheet" type="text/css" href="/_layouts/1033/styles/Themable/corev4.css?rev=p63%2BuzTeSJc22nVGNZ5zwg%3D%3D"/>
<link rel="stylesheet" href="css/style.css" type="text/css" />
<style type="text/css">
	#hdWrap {
	position:fixed;
	top:0;
	left:0;
	width:100%;
	height:40px;
	z-index:10;
	background-color:#fff;
}
#hd {
	padding:10px;
}
</style>
</head>
<body>

<form id="form1" runat="server">
	<div id="hdWrap">
		<div id="hd">
<table style="width:100%;margin:0;padding:0" cellpadding="0" cellspacing="0">
	<tr>
		<td colspan="2">
			<table cellspacing="4" cellpadding="0" style="width:100%">
				<tr>
					<td style="width:99%">&nbsp;</td>
					<td><a id="autoscroll" style="text-decoration:underline" href="#">Scroll</a></td>
					<td>|</td>
					<td><a id="autostop" style="text-decoration:underline" href="#">Stop</a></td>
				</tr>
			</table>
		</td>
	</tr>
</table>
	</div>
</div>

<div class="appContainer" style="margin-top:40px;"></div>
</form>
<script src="/_layouts/1033/init.js"></script>
    <script src="/_layouts/MicrosoftAjax.js"></script>
    <script src="/_layouts/sp.core.js"></script>
    <script src="/_layouts/sp.runtime.js"></script>
    <script src="/_layouts/sp.js"></script>
<script src="js/lib/require.js"></script>
	 <script type="text/javascript">


	     ExecuteOrDelayUntilScriptLoaded(function () {
	         requirejs.spWebURL = _spPageContextInfo.webServerRelativeUrl;
	         require(['js/common'], function (common) {
	             require(['app/datacontext', 'app/projection'], function (datacontext, UI) {
	                 $.when(
                         datacontext.getCCIRS(),
                         datacontext.getSignificantWatchlogEvents('Watch Log - EXCON'),
                         datacontext.getSignificantWatchlogEvents('Watch Log - SOATG'),
                         datacontext.getSignificantWatchlogEvents('Watch Log - SOCC'),
                         datacontext.getSignificantWatchlogEvents('Watch Log - SOTG 15'),
                         datacontext.getSignificantWatchlogEvents('Watch Log - SOTG 25'),
                         datacontext.getSignificantWatchlogEvents('Watch Log - SOTG 35'),
                         datacontext.getBattleRhythmForNext24Hours(),
                         datacontext.getSignifcantMessageTraffic('Inbound Message'),
                         datacontext.getSignifcantMessageTraffic('Outbound Message'),
                         datacontext.getMissions(),
                         datacontext.getCommStatuses(),
                         datacontext.getOpenCollectionReqs()
                         )
                         .then(function (ccirs, exconItems, soatgItems, soccItems, sotg15Items, sotg25Items, sotg35Items, battleRhythmItems, inboundMessages, outboundMessages, missionItems, commsStatuses, openRFI) {

                             var watchlogItems = [];
                             watchlogItems = watchlogItems.concat(exconItems);
                             watchlogItems = watchlogItems.concat(soatgItems);
                             watchlogItems = watchlogItems.concat(soccItems);
                             watchlogItems = watchlogItems.concat(sotg15Items);
                             watchlogItems = watchlogItems.concat(sotg25Items);
                             watchlogItems = watchlogItems.concat(sotg35Items);

                             UI.render({
                                 ccirData: ccirs,
                                 watchlogData: watchlogItems,
                                 battleRhythmData: battleRhythmItems,
                                 inboundMessageData: inboundMessages,
                                 outboundMessageData: outboundMessages,
                                 missionData: missionItems,
                                 commsData: commsStatuses,
                                 rfiData: openRFI
                             });

                         });
	             });
	         });

	     }, "sp.js");

    </script>

</body>
</html>
