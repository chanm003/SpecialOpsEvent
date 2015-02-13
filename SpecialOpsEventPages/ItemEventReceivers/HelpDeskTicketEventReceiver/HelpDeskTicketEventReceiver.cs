using System;
using System.Security.Permissions;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.Workflow;
using System.Collections.Generic;


namespace SpecialOpsEventPages.ItemEventReceivers.HelpDeskTicketEventReceiver
{
    /// <summary>
    /// List Item Events
    /// </summary>
    public class HelpDeskTicketEventReceiver : SPItemEventReceiver
    {
        /// <summary>
        /// An item is being updated.
        /// </summary>
        public override void ItemUpdating(SPItemEventProperties properties)
        {
            base.ItemUpdating(properties);
            CheckIfUserChangedValue_Status(properties);
        }

        private void CheckIfUserChangedValue_Status(SPItemEventProperties properties)
        {
            var li = properties.ListItem;

            var status_after = properties.AfterProperties["Status"] as string;
            var statusHasChanged = !Utility.AreEqualStringObjects(li["Status"], status_after);

            if (statusHasChanged && status_after == "Resolved")
            {
                SendOutTicketResolvedEmail(properties);
            }
        }

        private void SendOutTicketResolvedEmail(SPItemEventProperties properties)
        {
            Utility utility = new Utility();

            var ticket = properties.ListItem;
            var customer = ticket["Customer"].ToString();

            SPFieldUserValue customerValue =
                  new SPFieldUserValue(
                    ticket.Web, customer);

            var to = new List<SPPrincipal> { customerValue.User };
            var cc = new List<SPPrincipal>();

            var dispFormUrl = ticket.ParentList.ParentWeb.Site.MakeFullUrl(ticket.ParentList.DefaultDisplayFormUrl);
            var currentItemUrl = dispFormUrl + "?ID=" + ticket["ID"];
            var subject = "Your request has been resolved";
            var msg = "";
            msg += "<b>Title:</b> " + ticket["Title"];
            msg += "<br/><br/><a href='" + currentItemUrl + "'>Click here to view your request</a>";
           
            utility.AddItemToMailMessages(properties.Web, to, cc, subject, msg);
        }

        private void SendOutTicketCreatedEmail(SPItemEventProperties properties)
        {
            Utility utility = new Utility();

            var ticket = properties.ListItem;
            var customer = ticket["Customer"].ToString();

            SPFieldUserValue customerValue =
                  new SPFieldUserValue(
                    ticket.Web, customer);

            var to = new List<SPPrincipal> { customerValue.User };
            var cc = new List<SPPrincipal>();

            var dispFormUrl = ticket.ParentList.ParentWeb.Site.MakeFullUrl(ticket.ParentList.DefaultDisplayFormUrl);
            var currentItemUrl = dispFormUrl + "?ID=" + ticket["ID"];
            var subject = "Your Help Desk request has been submitted";
            var msg = "";
            msg += "<b>Title:</b> " + ticket["Title"];
            msg += "<br/><br/><a href='" + currentItemUrl + "'>Click here to view your request</a>";

            utility.AddItemToMailMessages(properties.Web, to, cc, subject, msg);
        }

        /// <summary>
        /// An item was added.
        /// </summary>
        public override void ItemAdded(SPItemEventProperties properties)
        {
            base.ItemAdded(properties);
            SendOutTicketCreatedEmail(properties);
        }

    }
}