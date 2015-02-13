using System;
using System.Security.Permissions;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.Workflow;
using System.Collections.Generic;
using System.Linq;

namespace SpecialOpsEventPages.ItemEventReceivers.RfiItemEventReceiver
{
    /// <summary>
    /// List Item Events
    /// </summary>
    public class RfiItemEventReceiver : SPItemEventReceiver
    {
        /// <summary>
        /// An item is being updated.
        /// </summary>
        public override void ItemUpdating(SPItemEventProperties properties)
        {
            base.ItemUpdating(properties);
            CheckIfUserEnteredValue_ClosedDate(properties);
            CheckIfUserEnteredValue_ResponseInsufficient(properties);
        }

        private void CheckIfUserEnteredValue_ResponseInsufficient(SPItemEventProperties properties)
        {
            var rfiItem = properties.ListItem;

            var status = rfiItem["Status"] as string;
            var responseSufficient_after = properties.AfterProperties["ResponseSufficient"] as string;
            var responseSufficientHasChanged = !Utility.AreEqualStringObjects(rfiItem["ResponseSufficient"], responseSufficient_after);

            if (status == "Closed" && responseSufficientHasChanged && responseSufficient_after == "No")
            {
                //RFI item is closed and ResponseSufficient was changed to "No"
                //so set status to 'Open', clear-out DateClosed,  set RfiReturned to 'Yes', and email respondent
                ReopenRfi(properties);
                SendOutRfiReopenedEmail(properties);
            }
        }

        private void SendOutRfiReopenedEmail(SPItemEventProperties properties)
        {
            Utility utility = new Utility();

            var rfiItem = properties.ListItem;
            var respondent = rfiItem["Respondent"].ToString();

            SPFieldUserValue respondentValue =
                  new SPFieldUserValue(
                    rfiItem.Web, respondent);

            var to = new List<SPPrincipal> { respondentValue.User };
            var cc = new List<SPPrincipal>();

            var dispFormUrl = rfiItem.ParentList.ParentWeb.Site.MakeFullUrl(rfiItem.ParentList.DefaultDisplayFormUrl);
            var currentItemUrl = dispFormUrl + "?ID=" + rfiItem["ID"];
            var subject = "RFI Reopened: " + rfiItem["Title"];
            var msg = "";
            msg += "<b>Title:</b> " + rfiItem["Title"];
            msg += "<br/><b>ID:</b> " + rfiItem["ID"];
            msg += "<br/><b>Priority:</b> " + rfiItem["Priority"];
            msg += "<br/><b>Recommended OPR:</b> " + rfiItem["RecommendedOPR"];
            msg += "<br/><b>Why Insufficient:</b> " + properties.AfterProperties["InsufficientExplanation"];

            msg += "<br/><br/><a href='" + currentItemUrl + "'>Click here to view the RFI</a>";

            utility.AddItemToMailMessages(properties.Web, to, cc, subject, msg);
        }

        private void ReopenRfi(SPItemEventProperties properties)
        {
            using (DisabledEventsScope scope = new DisabledEventsScope())
            {
                properties.AfterProperties["Status"] = "Open";
                properties.AfterProperties["DateClosed"] = "";
                properties.AfterProperties["RFIReturned"] = "Yes";
            }
        }

        private void CheckIfUserEnteredValue_ClosedDate(SPItemEventProperties properties)
        {
            var rfiItem = properties.ListItem;

            var status = rfiItem["Status"] as string;
            var dateClosed_after = properties.AfterProperties["DateClosed"] as string; //AfterProperties Formated as string: 2014-08-01T00:00:00Z
            var dateClosedHasChanged = !Utility.AreEqualStringObjects(rfiItem["DateClosed"], dateClosed_after);
            var dateClosedIsPopulated = !String.IsNullOrEmpty(dateClosed_after);

            if (status == "Open" && dateClosedHasChanged && dateClosedIsPopulated)
            {
                //RFI item is open and DateClosed was changed to non-null
                //so set status to 'Closed' and email POC
                CloseRfi(properties);
                SendOutRfiClosedEmail(properties);
            }
        }

        private void SendOutRfiClosedEmail(SPItemEventProperties properties)
        {
            Utility utility = new Utility();

            var rfiItem = properties.ListItem;
            var poc = rfiItem["POC"].ToString();

            SPFieldUserValue pocValue =
                  new SPFieldUserValue(
                    rfiItem.Web, poc);

            var to = new List<SPPrincipal> { pocValue.User };
            var cc = new List<SPPrincipal>();

            var dispFormUrl = rfiItem.ParentList.ParentWeb.Site.MakeFullUrl(rfiItem.ParentList.DefaultDisplayFormUrl);
            var currentItemUrl = dispFormUrl + "?ID=" + rfiItem["ID"];
            var subject = "RFI Closed: " + rfiItem["Title"];
            var msg = "";
            msg += "<b>Title:</b> " + rfiItem["Title"];
            msg += "<br/><b>ID:</b> " + rfiItem["ID"];
            msg += "<br/><b>Priority:</b> " + rfiItem["Priority"];
            msg += "<br/><b>Recommended OPR:</b> " + rfiItem["RecommendedOPR"];
            msg += "<br/><b>Details:</b> " + rfiItem["Details"];
            msg += "<br/><br/><a href='" + currentItemUrl + "'>Click here to review the information provided</a>";

            utility.AddItemToMailMessages(properties.Web, to, cc, subject, msg);
        }

        private void CloseRfi(SPItemEventProperties properties)
        {
            using (DisabledEventsScope scope = new DisabledEventsScope())
            {
                properties.AfterProperties["Status"] = "Closed";
                properties.AfterProperties["ResponseSufficient"] = "";

                var respondent = properties.AfterProperties["Respondent"] as string;
                if (String.IsNullOrEmpty(respondent))
                {
                    //set to current user
                    var currentUserId = properties.Web.CurrentUser.ID.ToString();
                    properties.AfterProperties["Respondent"] = currentUserId;
                }
            }
        }

        private void SendOutRfiCreatedEmail(SPItemEventProperties properties)
        {
            Utility utility = new Utility();

            var rfiItem = properties.ListItem;
            var poc = rfiItem["POC"].ToString();

            SPFieldUserValue pocValue =
                  new SPFieldUserValue(
                    rfiItem.Web, poc);

            var to = new List<SPPrincipal> { pocValue.User };
            var cc = new List<SPPrincipal>();

            var dispFormUrl = rfiItem.ParentList.ParentWeb.Site.MakeFullUrl(rfiItem.ParentList.DefaultDisplayFormUrl);
            var currentItemUrl = dispFormUrl + "?ID=" + rfiItem["ID"];
            var subject = "Your RFI: " + rfiItem["Title"];
            var msg = "";
            msg += "<b>Title:</b> " + rfiItem["Title"];
            msg += "<br/><b>ID:</b> " + rfiItem["ID"];
            msg += "<br/><b>Priority:</b> " + rfiItem["Priority"];
            msg += "<br/><b>Recommended OPR:</b> " + rfiItem["RecommendedOPR"];
            msg += "<br/><b>Details:</b> " + rfiItem["Details"];
            msg += "<br/><br/><a href='" + currentItemUrl + "'>Click here to view the RFI</a>";

            utility.AddItemToMailMessages(properties.Web, to, cc, subject, msg);
        }

        /// <summary>
        /// An item was added.
        /// </summary>
        public override void ItemAdded(SPItemEventProperties properties)
        {
            base.ItemAdded(properties);
            SendOutRfiCreatedEmail(properties);
        }


    }
}