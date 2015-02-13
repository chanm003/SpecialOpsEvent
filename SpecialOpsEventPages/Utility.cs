using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.Workflow;
using System.Collections;
using ExtensionMethods;

namespace ExtensionMethods
{
    public static class SPListItemExtensions
    {
        /// 

        /// Returns the login name of an User-Field.
        /// 

        public static string GetFieldValueUserLogin(this SPListItem item,
          string fieldName)
        {
            if (item != null)
            {
                SPFieldUserValue userValue =
                  new SPFieldUserValue(
                    item.Web, item[fieldName] as string);
                return userValue.User.LoginName;
            }
            else
            {
                return string.Empty;
            }
        }

        /// 

        /// Sets the value of a User-Field to a login name.
        /// 

        public static void SetFieldValueUser(this SPListItem item,
          string fieldName, string loginName)
        {
            if (item != null)
            {
                item[fieldName] = item.Web.EnsureUser(loginName);
            }
        }

        /// 

        /// Sets the value of a User-Field to an SPPrincipal
        /// (SPGroup or SPUser).
        /// 

        public static void SetFieldValueUser(this SPListItem item,
          string fieldName, SPPrincipal principal)
        {
            if (item != null)
            {
                item[fieldName] = principal;
            }
        }

        public static void SetFieldValueUser(this SPListItem item,
          string fieldName, IEnumerable<SPPrincipal> principals)
        {
            if (item != null)
            {
                SPFieldUserValueCollection fieldValues =
                  new SPFieldUserValueCollection();

                foreach (SPPrincipal principal in principals)
                {
                    fieldValues.Add(
                      new SPFieldUserValue(
                        item.Web, principal.ID, principal.Name));
                }
                item[fieldName] = fieldValues;
            }
        }

        /// 

        /// Sets the value of a multivalue User-Field to
        /// a list of user names.
        /// 

        public static void SetFieldValueUser(this SPListItem item,
          string fieldName, IEnumerable<string> loginNames)
        {
            if (item != null)
            {
                SPFieldUserValueCollection fieldValues =
                  new SPFieldUserValueCollection();

                foreach (string loginName in loginNames)
                {
                    SPUser user = item.Web.EnsureUser(loginName);
                    fieldValues.Add(
                      new SPFieldUserValue(
                        item.Web, user.ID, user.Name));
                }

                item[fieldName] = fieldValues;
            }
        }
    }
}

namespace SpecialOpsEventPages
{
    public class Utility
    {
        public void AddItemToMailMessages(SPWeb web, IEnumerable<SPPrincipal> recipients, IEnumerable<SPPrincipal> ccRecipients, string subject, string msg)
        {
            var spList = web.Lists.TryGetList("MailMessages");
            if (spList != null)
            {
                var newItem = spList.AddItem();
                newItem["Title"] = subject;
                newItem["MessageBody"] = msg;
                newItem.SetFieldValueUser("To", recipients);
                newItem.SetFieldValueUser("CC", ccRecipients);
                newItem.Update();
            }
        }

        public static bool AreEqualStringObjects(object obj1, object obj2)
        {
            if (obj1 == null) return obj2 == null;
            if (obj2 == null) return false;
            return obj1.ToString() == obj2.ToString();
        }
    }

    public class DisabledEventsScope : SPItemEventReceiver, IDisposable
    {
        // Boolean to hold the original value of the EventFiringEnabled property 
        bool _originalValue;

        public DisabledEventsScope()
        {
            // Save off the original value of EventFiringEnabled 
            _originalValue = base.EventFiringEnabled;

            // Set EventFiringEnabled to false to disable it 
            base.EventFiringEnabled = false;
        }

        public void Dispose()
        {
            // Set EventFiringEnabled back to its original value 
            base.EventFiringEnabled = _originalValue;
        }
    }
}
