<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=14.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
<SharePoint:ListItemProperty ID="ListItemProperty1" Property="PageTitle" maxlength="40" runat="server"/>Current Operations Summary
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">Current Operations Summary
	
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

</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="PlaceHolderUtilityContent" runat="server">
	<SharePoint:ScriptLink ID="ScriptLink1" language="javascript"
    name="~site/app/js/lib/require.js"
    runat="server"/>
    <script type="text/javascript">

        ExecuteOrDelayUntilScriptLoaded(function () {

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

</asp:Content>
