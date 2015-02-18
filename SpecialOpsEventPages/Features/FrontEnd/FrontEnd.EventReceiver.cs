using System;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using Microsoft.SharePoint;

namespace SpecialOpsEventPages.Features.FrontEnd
{
    /// <summary>
    /// This class handles events raised during feature activation, deactivation, installation, uninstallation, and upgrade.
    /// </summary>
    /// <remarks>
    /// The GUID attached to this class may be used during packaging and should not be modified.
    /// </remarks>

    [Guid("d63866ec-515f-419d-8150-97e662d5cf6b")]
    public class FrontEndEventReceiver : SPFeatureReceiver
    {
        public override void FeatureActivated(SPFeatureReceiverProperties properties)
        {
            //MAY CHANGE TO ROOTWEB and SCOPE this to Site Collection later on
            var web = properties.Feature.Parent as SPWeb;
            ApplyMasterPage(web, "v4-specialOpsEvent.master");
            SetDefaultPage(web, "app/socc.aspx");
            ChangeDefaultListForms_AirSupportRequest(web);
            ChangeDefaultListForms_RFI(web);
        }

        private void ApplyMasterPage(SPWeb web, string masterPageFileName)
        {
            Uri masterURI = new Uri(web.Url + "/_catalogs/masterpage/" + masterPageFileName);

            //used by non-publishing pages
            web.MasterUrl = masterURI.AbsolutePath;
            //used by publishing pages
            web.CustomMasterUrl = masterURI.AbsolutePath;

            web.Update();
        }

        private void SetDefaultPage(SPWeb web, string pageUrl)
        {
            //param: pageUrl
            //should be format "app/SOCC.aspx" and relative to current web

            /* Methods in Microsoft.Share.Publishing.dll are not sandbox-friendly
            if (PublishingWeb.IsPublishingWeb(web))
            {
                //site has publishing enabled
                var publishingWeb = PublishingWeb.GetPublishingWeb(web);
                publishingWeb.DefaultPage = web.GetFile(SPUrlUtility.CombineUrl(web.Url, pageUrl));
                publishingWeb.Update();
                return;
            }
            */

            //only works on non-publishing site
            SPFolder rootFolder = web.RootFolder;
            rootFolder.WelcomePage = pageUrl;
            rootFolder.Update();
        }

        private void ChangeDefaultListForms_AirSupportRequest(SPWeb web)
        {
            var list = web.Lists.TryGetList("Air Support Requests");
            if (list != null)
            {
                list.ContentTypesEnabled = true;
                var ct = list.ContentTypes["Item"];
                ct.NewFormUrl = web.ServerRelativeUrl + "/Lists/AirSupportRequests/customNewForm.aspx";
                ct.Update();
                list.Update();
            }
        }

        private void ChangeDefaultListForms_RFI(SPWeb web)
        {
            var list = web.Lists.TryGetList("Request For Information");
            if (list != null)
            {
                list.ContentTypesEnabled = true;
                var ct = list.ContentTypes["Item"];
                ct.DisplayFormUrl = web.ServerRelativeUrl + "/Lists/RFI/customDispForm.aspx";
                ct.EditFormUrl = web.ServerRelativeUrl + "/Lists/RFI/customEditForm.aspx";
                ct.Update();
                list.Update();
            }
        }

        private void PerformCleanupOnPropertyBag(SPWeb web)
        {
            //Writing to property bag seems to work when attaching debugger to sandbox worker process
            //HOWEVER, Javascript appears to be reading/writing to a completely different property bag
            //web.DeleteProperty("customGlobalNav");
            //web.Update();
        }

        public override void FeatureDeactivating(SPFeatureReceiverProperties properties)
        {
            //MAY CHANGE TO ROOTWEB and SCOPE this to Site Collection later on
            var web = properties.Feature.Parent as SPWeb;
            ApplyMasterPage(web, "v4.master");
          
        }



        // Uncomment the method below to handle the event raised after a feature has been installed.

        //public override void FeatureInstalled(SPFeatureReceiverProperties properties)
        //{
        //}


        // Uncomment the method below to handle the event raised before a feature is uninstalled.

        //public override void FeatureUninstalling(SPFeatureReceiverProperties properties)
        //{
        //}

        // Uncomment the method below to handle the event raised when a feature is upgrading.

        //public override void FeatureUpgrading(SPFeatureReceiverProperties properties, string upgradeActionName, System.Collections.Generic.IDictionary<string, string> parameters)
        //{
        //}
    }
}
