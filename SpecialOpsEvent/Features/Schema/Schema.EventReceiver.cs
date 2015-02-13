using System;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using Microsoft.SharePoint;
using System.Collections.Generic;
using System.Linq;

namespace SpecialOpsEvent.Features.Schema
{
    /// <summary>
    /// This class handles events raised during feature activation, deactivation, installation, uninstallation, and upgrade.
    /// </summary>
    /// <remarks>
    /// The GUID attached to this class may be used during packaging and should not be modified.
    /// </remarks>

    [Guid("fb0f6eb2-44cf-42bb-8cb3-e4891758d74b")]
    public class SchemaEventReceiver : SPFeatureReceiver
    {
        private Dictionary<string, List<string>> orgsForComponent = new Dictionary<string, List<string>>() { 
            {"EXCON", new List<string> {"Embassy", "Higher Headquarters"} },
            {"SOATG", new List<string> {"SOATG"} },
            {"SOCC", new List<string> {  
                "OPCEN - Operations",
                "OPCEN - Intelligence",
                "OPCEN - JPG",
                "SUPCEN - Personnel",
                "SUPCEN - Logistics",
                "Legal",
                "Medical",
                "Public Affairs"
            } 
            },
            {"SIGCEN", new List<string> {"SIGCEN"} },
            {"SOTG-15", new List<string> {"SOTG-15"} },
            {"SOTG-25", new List<string> {"SOTG-25"} },
            {"SOTG-35", new List<string> {"SOTG-35"} }
        };
        public override void FeatureActivated(SPFeatureReceiverProperties properties)
        {
            var web = properties.Feature.Parent as SPWeb;
            ChangeRegionalSettings(web);

            ModifyWatchLogLists(web);
            ModifyLibraries(web);
        }

        private void ModifyLibraries(SPWeb web)
        {
            AddOptionsToChoiceField(web,
                "EXCON Documents",
                "OrganizationalComponent",
                orgsForComponent["EXCON"],
                "");

            AddOptionsToChoiceField(web,
                "SOATG Documents",
                "OrganizationalComponent",
                orgsForComponent["SOATG"],
                "SOATG");

            AddOptionsToChoiceField(web,
                "SOCC Documents",
                "OrganizationalComponent",
                orgsForComponent["SOCC"],
                "");

            AddOptionsToChoiceField(web,
                "SIGCEN Documents",
                "OrganizationalComponent",
                orgsForComponent["SIGCEN"],
                "SIGCEN");

            AddOptionsToChoiceField(web,
                "SOTG-15 Documents",
                "OrganizationalComponent",
                orgsForComponent["SOTG-15"],
                "SOTG-15");

            AddOptionsToChoiceField(web,
               "SOTG-25 Documents",
               "OrganizationalComponent",
               orgsForComponent["SOTG-25"],
               "SOTG-25");

            AddOptionsToChoiceField(web,
               "SOTG-35 Documents",
               "OrganizationalComponent",
               orgsForComponent["SOTG-35"],
               "SOTG-35");


        }

        private void ModifyWatchLogLists(SPWeb web)
        {
            AddOptionsToChoiceField(web,
                "Watch Log - EXCON",
                "OrganizationalComponent",
                orgsForComponent["EXCON"],
                "");

            AddOptionsToChoiceField(web,
                "Watch Log - SOATG",
                "OrganizationalComponent",
                orgsForComponent["SOATG"],
                "SOATG");

            AddOptionsToChoiceField(web,
                "Watch Log - SOCC",
                "OrganizationalComponent",
                orgsForComponent["SOCC"],
                "");

            AddOptionsToChoiceField(web,
                "Watch Log - SIGCEN",
                "OrganizationalComponent",
                orgsForComponent["SIGCEN"],
                "SIGCEN");

            AddOptionsToChoiceField(web,
                "Watch Log - SOTG 15",
                "OrganizationalComponent",
                orgsForComponent["SOTG-15"],
                "SOTG-15");

            AddOptionsToChoiceField(web,
               "Watch Log - SOTG 25",
               "OrganizationalComponent",
               orgsForComponent["SOTG-25"],
               "SOTG-25");

            AddOptionsToChoiceField(web,
               "Watch Log - SOTG 35",
               "OrganizationalComponent",
               orgsForComponent["SOTG-35"],
               "SOTG=35");

            AddOptionsToChoiceField(web,
               "Help Desk",
               "OrganizationalComponent",
               new List<string> {  
                    "SOCC - Operations",
                    "SOCC - Intel",
                    "SOCC - SIGCEN",
                    "SOCC - SUPCEN",
                    "SOTG1",
                    "SOTG2",
                    "SOTG3",
                    "SOATG",
                    "Higher Headquarters",
                    "Embassy",
                    "EXCON",
                    "EPIE",
                    "HSC-84"
                },
               "");

            AddOptionsToChoiceField(web,
               "Phonebook",
               "OrganizationalComponent",
               new List<string> {  
                    "Command Group",
                    "OPCEN - Operations",
                    "OPCEN - Intelligence",
                    "SIGCEN",
                    "SUPCEN - Personnel",
                    "SUPCEN - Logistics",
                    "Legal",
                    "Medical",
                    "Public Affairs",
                    "SOATG",
                    "Higher Headquarters",
                    "Embassy",
                    "EXCON",
                    "SOTG-15",
                    "SOTG-25",
                    "SOTG-35",
                    "EPIE",
                    "HSC-84"
                },
               "");
        }

        private void ChangeRegionalSettings(SPWeb web)
        {
            if (web != null)
            {
                web.RegionalSettings.Time24 = true;
                web.Update();
            }
        }

        private void AddOptionsToChoiceField(SPWeb web, string listName, string staticFieldName, List<string> choices, string defaultChoice)
        {
            var spList = web.Lists.TryGetList(listName);
            if (spList != null)
            {
                var spFieldChoice = spList.Fields.TryGetFieldByStaticName(staticFieldName) as SPFieldChoice;
                if (spFieldChoice != null)
                {
                    //workaround bug as documented on sharepoint.stackexchange/questions/29519
                    var choicesXML = "";
                    choices.ForEach(opt =>
                    {
                        choicesXML += String.Format("<CHOICE>{0}</CHOICE>", opt);
                    });

                    var defaultChoiceXML = "";
                    if (!String.IsNullOrEmpty(defaultChoice))
                    {
                        defaultChoiceXML = String.Format("<Default>{0}</Default>", defaultChoice);
                    }

                    //this function assumes that the current choice field has no choices yet
                    var originalXML = spFieldChoice.SchemaXml;
                    var newXML = originalXML.Replace("<CHOICES/>", String.Format("{0}<CHOICES>{1}</CHOICES>", defaultChoiceXML, choicesXML));
                    spFieldChoice.SchemaXml = newXML;

                    spFieldChoice.Update();
                    spList.Update();
                }
            }
        }


        // Uncomment the method below to handle the event raised before a feature is deactivated.

        //public override void FeatureDeactivating(SPFeatureReceiverProperties properties)
        //{
        //}


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
