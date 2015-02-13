using System;
using System.Security.Permissions;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.Workflow;

namespace SpecialOpsEventPages.ItemEventReceivers.DocumentEventReceiver
{
    /// <summary>
    /// List Item Events
    /// </summary>
    public class DocumentEventReceiver : SPItemEventReceiver
    {
        /// <summary>
        /// A file is being moved.
        /// </summary>
        public override void ItemFileMoving(SPItemEventProperties properties)
        {
            base.ItemFileMoving(properties);
            var docType = properties.ListItem["DocType"] as string;
            var docType_after = properties.AfterProperties["DocType"] as string;
            var docTypeChanged = !Utility.AreEqualStringObjects(docType, docType_after);

            if (!docTypeChanged && docType_after == "CONOP Concept of Operations")
            {
                properties.Status = SPEventReceiverStatus.CancelWithError;
                properties.Cancel = true;
                properties.ErrorMessage = "CONOP cannot be moved/renamed while Chop Process is ongoing";
            }
        }


    }
}