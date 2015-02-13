define(function (require) {

    //dependencies
    var $ = require('jquery'),
        _ = require('underscore'),
        moment = require('moment'),
        spServices = require('spServices');

    var schemas = {
        airSupportRequests: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='Attachments' />\
                    <FieldRef Name='FileDirRef' />\
                    <FieldRef Name='RequestorRankTitle' />\
                    <FieldRef Name='Status' />\
                    <FieldRef Name='MissionStartDate' />\
                    <FieldRef Name='MissionEndDate' />\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_Attachments: { mappedName: "hasAttachment", objectType: "Boolean" },
                ows_FileDirRef: { mappedName: "fileDirRef", objectType: "Lookup" },
                ows_RequestorRankTitle: { mappedName: "requestorRankTitle", objectType: "Text" },
                ows_Status: { mappedName: "status", objectType: "Text" },
                ows_MissionStartDate: { mappedName: "missionStartDate", objectType: "DateTime" },
                ows_MissionEndDate: { mappedName: "missionEndDate", objectType: "DateTime" }
            }
        },
        announcements: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='Body' />\
                    <FieldRef Name='Expires' />\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_Body: { mappedName: "body", objectType: "Text" },
                ows_Expires: { mappedName: "expires", objectType: "DateTime" }
            }
        },
        ccirs: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='CCIRCategory' />\
                    <FieldRef Name='CCIRStatus' />\
                    <FieldRef Name='CCIRNumber' />\
                    <FieldRef Name='CCIRDescription' />\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_CCIRCategory: { mappedName: "category", objectType: "Text" },
                ows_CCIRStatus: { mappedName: "status", objectType: "Text" },
                ows_CCIRNumber: { mappedName: "number", objectType: "Text" },
                ows_CCIRDescription: { mappedName: "description", objectType: "Text" }
            }
        },
        commStatuses: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='Body' />\
                    <FieldRef Name='Expires' />\
                    <FieldRef Name='SortOrder'/>\
					<FieldRef Name='UNCLASSData'/>\
					<FieldRef Name='BICESData'/>\
					<FieldRef Name='SECRETData'/>\
					<FieldRef Name='TSData'/>\
					<FieldRef Name='UNCLASSPhone'/>\
					<FieldRef Name='BICESPhone'/>\
					<FieldRef Name='SECRETPhone'/>\
					<FieldRef Name='TACSATRadio'/>\
					<FieldRef Name='BICESVTC'/>\
					<FieldRef Name='SECRETVTC'/>\
					<FieldRef Name='TSVTC'/>\
					<FieldRef Name='PackageComments'/>\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "package", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_SortOrder: { mappedName: "sortOrder", objectType: "Text" },
                ows_PackageComments: { mappedName: "comments", objectType: "Text" },
                ows_UNCLASSData: { mappedName: "unclassData", objectType: "Text" },
                ows_BICESData: { mappedName: "bicesData", objectType: "Text" },
                ows_SECRETData: { mappedName: "secretData", objectType: "Text" },
                ows_TSData: { mappedName: "tsData", objectType: "Text" },
                ows_UNCLASSPhone: { mappedName: "unclassPhone", objectType: "Text" },
                ows_BICESPhone: { mappedName: "bicesPhone", objectType: "Text" },
                ows_SECRETPhone: { mappedName: "secretPhone", objectType: "Text" },
                ows_TACSATRadio: { mappedName: "tacsatRadio", objectType: "Text" },
                ows_BICESVTC: { mappedName: "bicesVtc", objectType: "Text" },
                ows_SECRETVTC: { mappedName: "secretVtc", objectType: "Text" },
                ows_TSVTC: { mappedName: "tsVtc", objectType: "Text" }
            }
        },
        conopChops: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
					<FieldRef Name='SignOnBehalfOf'/>\
					<FieldRef Name='Verdict'/>\
					<FieldRef Name='ConopLibraryUrl'/>\
                    <FieldRef Name='ConopID'/>\
                    <FieldRef Name='CommentsOnConop'/>\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_SignOnBehalfOf: { mappedName: "signOnBehalfOf", objectType: "Text" },
                ows_Verdict: { mappedName: "verdict", objectType: "Text" },
                ows_ConopLibraryUrl: { mappedName: "libraryUrl", objectType: "Text" },
                ows_ConopID: { mappedName: "libraryFKID", objectType: "Text" },
                ows_CommentsOnConop: { mappedName: "comments", objectType: "Text" }
            }
        },
        eventCalendar: {
            camlViewFields:
                "<ViewFields>\
		    		<FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
		    		<FieldRef Name='EventDate' />\
		    		<FieldRef Name='EndDate' />\
                    <FieldRef Name='Location' />\
		    		<FieldRef Name='fRecurrence' />\
		    		<FieldRef Name='fAllDayEvent' />\
	    		</ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Text" }, //RECURRENCE EVENTS
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_EventDate: { mappedName: "eventDate", objectType: "DateTime" },
                ows_EndDate: { mappedName: "endDate", objectType: "DateTime" },
                ows_Location: { mappedName: "location", objectType: "Text" },
                ows_fRecurrence: { mappedName: "isRecurrence", objectType: "Boolean" },
                ows_fAllDayEvent: { mappedName: "isAllDayEvent", objectType: "Boolean" }
            }
        },
        helpDeskTickets: {
            camlViewFields:
                "<ViewFields>\
		    		<FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='FileDirRef' />\
                    <FieldRef Name='Customer' />\
                    <FieldRef Name='Priority' />\
                    <FieldRef Name='RequestType' />\
                    <FieldRef Name='AssignedTo' />\
                    <FieldRef Name='Status' />\
                    <FieldRef Name='ResolutionType' />\
                    <FieldRef Name='ResolutionDate' />\
	    		</ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" }, 
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_FileDirRef: { mappedName: "fileDirRef", objectType: "Lookup" },
                ows_Customer: { mappedName: "customer", objectType: "User" },
                ows_Priority: { mappedName: "priority", objectType: "Text" },
                ows_RequestType: { mappedName: "requestType", objectType: "Text" },
                ows_AssignedTo: { mappedName: "assignedTo", objectType: "UserMulti" },
                ows_Status: { mappedName: "status", objectType: "Text" },
                ows_ResolutionType: { mappedName: "resolutionType", objectType: "Text" },
                ows_ResolutionDate: { mappedName: "resolutionDate", objectType: "DateTime" }
            }
        },
        messageTraffic: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='DtgOrgTitle'/>\
					<FieldRef Name='DateTimeGroup'/>\
					<FieldRef Name='TaskInfo'/>\
					<FieldRef Name='Initials'/>\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_DateTimeGroup: { mappedName: "dateTimeGroup", objectType: "DateTime" },
                ows_DtgOrgTitle: { mappedName: "dtgOrgTitle", objectType: "Text" },
                ows_TaskInfo: { mappedName: "taskInfo", objectType: "Text" },
                ows_Initials: { mappedName: "initials", objectType: "Text" }
            }
        },
        missionDocuments: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
					<FieldRef Name='DocType'/>\
					<FieldRef Name='Mission'/>\
					<FieldRef Name='OrganizationalComponent'/>\
                    <FieldRef Name='FileRef'/>\
                    <FieldRef Name='FileLeafRef'/>\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_FileRef: { mappedName: "fileRef", objectType: "Lookup" },
                ows_FileLeafRef: { mappedName: "fileName", objectType: "Lookup" },
                ows_DocType: { mappedName: "docType", objectType: "Text" },
                ows_Mission: { mappedName: "mission", objectType: "Lookup" },
                ows_OrganizationalComponent: { mappedName: "organization", objectType: "Text" }
            }
        },
        missionTracker: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='Attachments' />\
                    <FieldRef Name='FileDirRef' />\
                    <FieldRef Name='Status' />\
					<FieldRef Name='MissionNumber'/>\
                    <FieldRef Name='MissionApproved'/>\
					<FieldRef Name='ExpectedExecution'/>\
                    <FieldRef Name='ExpectedTermination'/>\
                    <FieldRef Name='SOTG'/>\
					<FieldRef Name='Comments'/>\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_Attachments: { mappedName: "hasAttachment", objectType: "Boolean" },
                ows_FileDirRef: { mappedName: "fileDirRef", objectType: "Lookup" },
                ows_Status: { mappedName: "status", objectType: "Text" },
                ows_MissionNumber: { mappedName: "missionNumber", objectType: "Text" },
                ows_MissionApproved: { mappedName: "missionApproved", objectType: "DateTime" },
                ows_ExpectedExecution: { mappedName: "expectedExecution", objectType: "DateTime" },
                ows_ExpectedTermination: { mappedName: "expectedTermination", objectType: "DateTime" },
                ows_SOTG: { mappedName: "sotg", objectType: "Text" },
                ows_Comments: { mappedName: "comments", objectType: "Text" }
            }
        },
        msel: {
            camlViewFields:
                "<ViewFields>\
					<FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='From' />\
					<FieldRef Name='Description' />\
					<FieldRef Name='DateTimeGroup' />\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "subject", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_From: { mappedName: "from", objectType: "Text" },
                ows_Description: { mappedName: "description", objectType: "Text" },
                ows_DateTimeGroup: { mappedName: "dateTimeGroup", objectType: "DateTime" }
            }
        },
        navigation: {
            camlViewFields:
                "<ViewFields>\
					<FieldRef Name='JSON'/>\
                </ViewFields>",
            jsonMapping: {
                ows_JSON: { mappedName: "json", objectType: "JSON" }
            }
        },
        nodeStatuses: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
					<FieldRef Name='Package'/>\
					<FieldRef Name='Status'/>\
					<FieldRef Name='NodeComments'/>\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "nodeNumber", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_Package: { mappedName: "package", objectType: "Text" },
                ows_Status: { mappedName: "status", objectType: "Text" },
                ows_NodeComments: { mappedName: "comments", objectType: "Text" }
            }
        },
        rfi: {
            camlViewFields:
                "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
					<FieldRef Name='POCOrganization'/>\
					<FieldRef Name='LTIOV'/>\
                    <FieldRef Name='RfiTracking'/>\
                    <FieldRef Name='Priority'/>\
					<FieldRef Name='DateOpened'/>\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_POCOrganization: { mappedName: "pocOrganization", objectType: "Text" },
                ows_LTIOV: { mappedName: "ltiov", objectType: "DateTime" },
                ows_RfiTracking: { mappedName: "rfiTracking", objectType: "Integer" },
                ows_Priority: { mappedName: "priority", objectType: "Text" },
                ows_DateOpened: { mappedName: "dateOpened", objectType: "DateTime" }
            }
        },
        watchlog: {
            camlViewFields:
                 "<ViewFields>\
                    <FieldRef Name='ID' />\
                    <FieldRef Name='Title' />\
                    <FieldRef Name='Created' />\
                    <FieldRef Name='Modified' />\
                    <FieldRef Name='Author' />\
                    <FieldRef Name='Editor' />\
                    <FieldRef Name='OrganizationalComponent' />\
                    <FieldRef Name='DateTimeGroup' />\
                    <FieldRef Name='DTG' />\
                    <FieldRef Name='ActionTaken' />\
                    <FieldRef Name='YourInitials' />\
                </ViewFields>",
            jsonMapping: {
                ows_ID: { mappedName: "id", objectType: "Counter" },
                ows_Title: { mappedName: "title", objectType: "Text" },
                ows_Created: { mappedName: "created", objectType: "DateTime" },
                ows_Modified: { mappedName: "modified", objectType: "DateTime" },
                ows_Author: { mappedName: "author", objectType: "User" },
                ows_Editor: { mappedName: "editor", objectType: "User" },
                ows_OrganizationalComponent: { mappedName: "organization", objectType: "Text" },
                ows_DateTimeGroup: { mappedName: "dateTimeGroup", objectType: "DateTime" },
                ows_DTG: { mappedName: "dtg", objectType: "Text" },
                ows_ActionTaken: { mappedName: "actionTaken", objectType: "Text" },
                ows_YourInitials: { mappedName: "initials", objectType: "Text" }
            }
        }
    };

    function buildDefaultMenuItems() {
        var data = [
			{
			    text: "Custom Global Navigation (ensure this node remains the one and only root node)",
			    parent: "#",
			    state: {
			        disabled: true,
			        opened: true
			    }
			}
        ];
        return data;
    }

    function checkForNonApplicableValues(arrayJsonObjects) {
        //internal function to remove the forward slash
        _.each(arrayJsonObjects, function (item) {
            for (var prop in item) {
                if (item[prop] === "N/A") {                  
                    item[prop] = "NA";
                }
            }
        });
    }

    function copyMessageTrafficIntoMsel(listItemId) {
        return getMselItem(listItemId)
        	.then(createInboundMessage)
        	.then(markMselItemComplete);

        function createInboundMessage(msel) {
            return $().SPServices({
                operation: "UpdateListItems",
                listName: "Message Traffic",
                batchCmd: "New",
                valuepairs: [
	            	["Originator", msel.from],
	            	["Title", msel.subject],
	            	["TaskInfo", msel.description],
	            	["Comments", msel.description],
	            	["DateTimeGroup", moment(msel.dateTimeGroup).format("YYYY-MM-DDTHH:mm:ss.SSSZZ")],
	            	["MessageTraffic", "Inbound Message"],
	            	["Initials", "EXCON"]
                ]
            })
	        .then(function () {
	            return msel;
	        });

        }

        function getMselItem(listItemId) {
            var promise = $().SPServices({
                operation: "GetListItems",
                listName: 'MSEL',
                async: false,
                CAMLQuery: '<Query><Where><Eq><FieldRef Name="ID"/><Value Type="Counter">' + listItemId + '</Value></Eq></Where></Query>',
                CAMLViewFields: schemas.msel.camlViewFields
            }).then(function (xData, status) {
                var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                    mapping: schemas.msel.jsonMapping,
                    includeAllAttrs: false
                });

                if (json.length !== 1) {
                    promise.reject("Error: Could not find MSEL to copy");
                }

                var mselToBeCopied = json[0];
                return mselToBeCopied;
            });

            return promise;
        }

        function markMselItemComplete(msel) {
            return $().SPServices({
                operation: "UpdateListItems",
                listName: "MSEL",
                ID: msel.id,
                valuepairs: [
	            	["Status", "Complete"],
	            	["Injected", "Injected into Message Traffic list: " + moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ")]
                ]
            });
        }

    }

    function getAirSupportRequests() {
        var camlQuery =
            '<Query>\
                <OrderBy>\
                    <FieldRef Name="MissionStartDate"></FieldRef>\
                    <FieldRef Name="MissionEndDate"></FieldRef>\
                </OrderBy>\
             </Query>';

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Air Support Requests',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.airSupportRequests.camlViewFields
        }).then(function (xData, status) {
            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.airSupportRequests.jsonMapping,
                includeAllAttrs: false
            });

            json = _.map(json, function (item) {
                item.created = moment(item.created);
                item.missionStartDate = moment(item.missionStartDate);
                item.missionEndDate = moment(item.missionEndDate);
                item.dispFormUrl = "/" + item.fileDirRef.lookupValue + "/DispForm.aspx?ID=" + item.id;
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getAnnouncements_Current() {
        var camlQuery =
	        '<Query>\
                <Where>\
                    <Or>\
                        <IsNull><FieldRef Name="Expires" /></IsNull>\
                        <Geq>\
                            <FieldRef Name="Expires"></FieldRef>\
                            <Value Type="DateTime"><Today></Today></Value>\
                        </Geq>\
                    </Or>\
                </Where>\
                <OrderBy>\
                    <FieldRef Name="Modified" Ascending="FALSE"></FieldRef>\
                </OrderBy>\
            </Query>';

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Event Announcements',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.announcements.camlViewFields
        }).then(function (xData, status) {
            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.announcements.jsonMapping,
                includeAllAttrs: false
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getCCIRS() {
        var camlQuery =
            "<Query>\
			    <OrderBy>\
				    <FieldRef Name='CCIRCategory'/>\
                    <FieldRef Name='CCIRNumber'/>\
				</OrderBy>\
			</Query>";

        return $().SPServices({
            operation: "GetListItems",
            listName: 'CCIR',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.ccirs.camlViewFields
        }).then(function (xData, status) {
            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.ccirs.jsonMapping,
                includeAllAttrs: false
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getCommStatuses() {
        var camlQuery =
            "<Query>\
			    <OrderBy>\
				    <FieldRef Name='SortOrder'/>\
				</OrderBy>\
			</Query>";

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Communications Status',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.commStatuses.camlViewFields
        }).then(function (xData, status) {
            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.commStatuses.jsonMapping,
                includeAllAttrs: false
            });

            checkForNonApplicableValues(json);

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getConopChops() {
        return $().SPServices({
            operation: "GetListItems",
            listName: 'ConopChops',
            async: true,
            CAMLViewFields: schemas.conopChops.camlViewFields,
            CAMLQuery: '<Query><OrderBy><FieldRef Name="Modified" Ascending="FALSE"></FieldRef></OrderBy></Query>'
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.conopChops.jsonMapping,
                includeAllAttrs: false
            });

            json = _.map(json, function (item) {
                item.uniqueID = item.libraryUrl + ", id=" + item.libraryFKID;
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getEventCalendar_Next24Hours() {
        var now = moment();
        var plus24Hours = now.clone().add(1, 'days');

        return $.when(
			getEventCalendar_BattleRhythm(now.format("YYYY-MM-DD")),
            getEventCalendar_BattleRhythm(plus24Hours.format("YYYY-MM-DD"))
		).then(function (todayEv, tomorrowEv) {
            //combine two data sources
		    var eventsForTodayAndTomorrow = todayEv.concat(tomorrowEv);
            //remove any duplicates after consolidation
		    eventsForTodayAndTomorrow = _.uniq(eventsForTodayAndTomorrow, false, function (item) {
		        return item.id;
		    });

		    //items from today and tomorrow potentially too much data, so......
		    //***let's forget about events that ended earlier today, and 
		    //***let's forget about events that will start more than 24 hours from now 
		    var eventsInNext24 = _.filter(eventsForTodayAndTomorrow, function (item) {
		        return (item.eventDate <= plus24Hours && item.endDate >= now);
		    });

		    //Perform sort operation based on two columns---similar to T-SQL 'eventDate ASC, endDate ASC'
		    //TRICK using underscore:  want to sort 'eventDate ASC, endDate ASC', but must sortBy endDate first, then eventDate second
		    eventsInNext24 = _(eventsInNext24).chain()
                .sortBy('endDate')
                .sortBy('eventDate')
                .value();

		    return eventsInNext24;
		});
    }

    function getEventCalendar_BattleRhythm(selectedDate) {
        var camlQuery =
            "<Query>\
            	<CalendarDate>"+ selectedDate + "</CalendarDate>\
            	<Where>\
                    <And>\
                        <DateRangesOverlap>\
                            <FieldRef Name='EventDate'/>\
                            <FieldRef Name='EndDate'/>\
                            <FieldRef Name='RecurrenceID'/>\
                            <Value Type='DateTime'><Today/></Value>\
                        </DateRangesOverlap>\
                        <Eq>\
                            <FieldRef Name='Category'></FieldRef>\
                            <Value Type='Text'>Battle Rhythm</Value>\
                        </Eq>\
                    </And>\
            	</Where>\
            </Query>";

        var camlQueryOptions =
			"<QueryOptions>\
				<CalendarDate>"+ selectedDate + "</CalendarDate>\
				<RecurrencePatternXMLVersion>v3</RecurrencePatternXMLVersion>\
				<ExpandRecurrence>TRUE</ExpandRecurrence>\
			</QueryOptions>";

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Event Calendar',
            async: true,
            CAMLQuery: camlQuery,
            CAMLQueryOptions: camlQueryOptions,
            CAMLViewFields: schemas.eventCalendar.camlViewFields
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.eventCalendar.jsonMapping,
                includeAllAttrs: false
            });

            //convert dates into moments
            json = _.map(json, function (item) {
                item.eventDate = moment(item.eventDate);
                item.endDate = moment(item.endDate);
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getHelpDeskTickets() {
        return $().SPServices({
            operation: "GetListItems",
            listName: 'Help Desk',
            async: true,
            CAMLViewFields: schemas.helpDeskTickets.camlViewFields
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.helpDeskTickets.jsonMapping,
                includeAllAttrs: false
            });

            json = _.map(json, function (item) {
                item.created = moment(item.created);
                item.resolutionDate = moment(item.resolutionDate);
                item.dispFormUrl = "/" + item.fileDirRef.lookupValue + "/DispForm.aspx?ID=" + item.id;
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getMessageTraffic_Significant(type) {
        //param: type, possible choices: [inbound, outbond]
        var camlQuery =
            "<Query>\
                <OrderBy>\
                    <FieldRef Name='DateTimeGroup' Ascending='FALSE'/>\
                </OrderBy>\
            	<Where>\
                    <And>\
                        <Eq>\
                            <FieldRef Name='Significant'></FieldRef>\
                            <Value Type='Text'>Yes</Value>\
                        </Eq>\
                        <Eq>\
                            <FieldRef Name='MessageTraffic'></FieldRef>\
                            <Value Type='Text'>"+ type + "</Value>\
                        </Eq>\
                    </And>\
            	</Where>\
            </Query>";

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Message Traffic',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.messageTraffic.camlViewFields
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.messageTraffic.jsonMapping,
                includeAllAttrs: false
            });

            //dtgOrgTitle is calculated column (that returns string)
            json = _.map(json, function (item) {
                item.dtgOrgTitle = item.dtgOrgTitle.replace("string;#", "");
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getMissionDocuments(listName, camlQuery) {
        var camlQueryOptions =
            "<QueryOptions>\
                <ViewAttributes Scope='Recursive'/>\
            </QueryOptions>";

        return $().SPServices({
            operation: "GetListItems",
            listName: listName,
            async: true,
            CAMLQuery: camlQuery || "<Query></Query>",
            CAMLQueryOptions: camlQueryOptions,
            CAMLViewFields: schemas.missionDocuments.camlViewFields
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.missionDocuments.jsonMapping,
                includeAllAttrs: false
            });

            json = _.map(json, function (item) {
                item.missionName = "Not Specified";
                if (item.mission && item.mission.lookupValue) {
                    item.missionName = item.mission.lookupValue;
                }
                item.serverRelativeDocumentUrl = "/" + item.fileRef.lookupValue;
                item.libraryForDocument = item.serverRelativeDocumentUrl.replace(("/" + item.fileName.lookupValue), "");
                item.uniqueID = item.libraryForDocument + ", id=" + item.id;
                item.modified = moment(item.modified);
                item.fileName = item.fileName.lookupValue;
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getMissionDocumentsByType(listName, docType) {
        var camlQuery =
            "<Query>\
                <Where>\
                    <Eq>\
                        <FieldRef Name='DocType'></FieldRef>\
                        <Value Type='Text'>"+docType+"</Value>\
                    </Eq>\
                </Where>\
            </Query>";
        return getMissionDocuments(listName, camlQuery);
    }

    function getMissions() {
        var camlQuery =
            "<Query>\
                <OrderBy>\
                    <FieldRef Name='StatusSorted'/>\
                    <FieldRef Name='Status'/>\
                    <FieldRef Name='MissionNumber'/>\
                </OrderBy>\
            </Query>";

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Mission Tracker',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.missionTracker.camlViewFields
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.missionTracker.jsonMapping,
                includeAllAttrs: false
            });

            json = _.map(json, function (item) {
                item.missionApproved = moment(item.missionApproved);
                item.expectedExecution = moment(item.expectedExecution);
                item.expectedTermination = moment(item.expectedTermination);
                item.dispFormUrl = "/" + item.fileDirRef.lookupValue + "/DispForm.aspx?ID=" + item.id;
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getNavigation(shouldByPassLocalStorage) {
        var sessionStorageKey = "Navigation for " + _spPageContextInfo.webServerRelativeUrl;

        var navData = sessionStorage.getItem(sessionStorageKey);
        if (navData && !shouldByPassLocalStorage) {
            //navigation is cached
            var dfd = $.Deferred();
            setTimeout(function () {
                return dfd.resolve(JSON.parse(navData));
            }, 1);
            return dfd.promise();
        }

        //navigation is not cached so make network call
        return $().SPServices({
            operation: "GetListItems",
            listName: 'Navigation',
            async: true,
            CAMLViewFields: schemas.navigation.camlViewFields
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.navigation.jsonMapping,
                includeAllAttrs: false
            });

            if (json.length !== 1) {
                //List should have one and only one list item
                alert("Error: Unable to retrieve navigation...");
            } else {
                var navData = json[0].json;
                sessionStorage.setItem(sessionStorageKey, JSON.stringify(navData));
                return navData;
            }


        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getNodeStatuses() {
        var camlQuery =
            "<Query>\
			    <OrderBy>\
				    <FieldRef Name='Package'/>\
                    <FieldRef Name='Title'/>\
				</OrderBy>\
			</Query>";

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Node Status',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.nodeStatuses.camlViewFields
        }).then(function (xData, status) {
            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.nodeStatuses.jsonMapping,
                includeAllAttrs: false
            });

            checkForNonApplicableValues(json);

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });

    }

    function getRFI_OpenCollectionReqs() {
        var camlQuery =
            "<Query>\
                <OrderBy>\
                    <FieldRef Name='LTIOV'/>\
                    <FieldRef Name='PrioritySort'/>\
                </OrderBy>\
                <Where>\
                    <And>\
                        <Eq>\
                            <FieldRef Name='CollectionRequirement'></FieldRef>\
                            <Value Type='Text'>Yes</Value>\
                        </Eq>\
                        <Eq>\
                            <FieldRef Name='Status'></FieldRef>\
                            <Value Type='Text'>Open</Value>\
                        </Eq>\
                    </And>\
            	</Where>\
            </Query>";

        return $().SPServices({
            operation: "GetListItems",
            listName: 'Request for Information',
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.rfi.camlViewFields
        }).then(function (xData, status) {

            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.rfi.jsonMapping,
                includeAllAttrs: false
            });

            json = _.map(json, function (item) {
                item.ltiov = moment(item.ltiov);
                item.dateOpened = moment(item.dateOpened);
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });
    }

    function getGlobalNavMenuItems() {
        /*
        DEPRECATED: new approach no longer uses SPWeb object's property bag
        var $dfd = $.Deferred();

        var rootWebProperties = null,
			ctx = SP.ClientContext.get_current();

        rootWebProperties = ctx.get_web().get_allProperties();
        ctx.load(rootWebProperties);
        ctx.executeQueryAsync(function () {
            var allProps = rootWebProperties.get_fieldValues(),
                dataSource = allProps["customGlobalNav"]

            if (dataSource) {
                //$dfd.resolve(buildDefaultMenuItems());
                $dfd.resolve(JSON.parse(dataSource));
            } else {
                $dfd.resolve(buildDefaultMenuItems());
            }
        },
			function (sender, args) {
			    alert("Error occurred retrieving the PNT navigation:\n" + args.get_message());
			});

        return $dfd;
        */
    }
   
    function getStatusForRFI_Synch(id) {
        var status = "";
        $().SPServices({
            operation: 'GetListItems',
            async: false, //SYNCHRONOUS
            listName: 'Request for Information',
            CAMLViewFields: '<ViewFields><FieldRef Name="Status" /></ViewFields>',
            CAMLQuery: '<Query><Where><Eq><FieldRef Name="ID"/><Value Type="Counter">' + id + '</Value></Eq></Where></Query>',
            completefunc: function (xData, Status) {
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                    status = $(this).attr("ows_Status");
                });
            }

        });
        return status;
    }

    function getWatchlog_SignificantEvents(listName) {
        var camlQuery =
	        '<Query>\
                <Where>\
                    <Eq>\
                        <FieldRef Name="Significant"></FieldRef>\
                        <Value Type="Text">Yes</Value>\
                    </Eq>\
                </Where>\
                <OrderBy>\
                    <FieldRef Name="DTG" Ascending="FALSE"></FieldRef>\
                </OrderBy>\
            </Query>';

        return $().SPServices({
            operation: "GetListItems",
            listName: listName,
            async: true,
            CAMLQuery: camlQuery,
            CAMLViewFields: schemas.watchlog.camlViewFields
        }).then(function (xData, status) {
            var mapping = schemas.watchlog.jsonMapping
            var json = $(xData).SPFilterNode("z:row").SPXmlToJson({
                mapping: schemas.watchlog.jsonMapping,
                includeAllAttrs: false
            });

            //dtg is calculated column (that returns string)
            json = _.map(json, function (item) {
                item.dtg = item.dtg.replace("string;#", "");
                return item;
            });

            return json;
        }).fail(function (xData, status) {
            return xData.responseText;
        });

    }

    function prepopulateWithDefaultNavMenuItems() {
        if (confirm("This will overwrite existing menu items (if there ar any)") == true) {
            var data = [{ "id": "j1_1", "text": "Custom Navigation (ensure this node remains the one and only root node)", "icon": true, "li_attr": { "id": "j1_1" }, "a_attr": { "href": "#", "id": "j1_1_anchor" }, "state": { "loaded": true, "opened": true, "selected": false, "disabled": true }, "data": {}, "children": [{ "id": "j1_2", "text": "SOCC", "icon": true, "li_attr": { "id": "j1_2", "url": "app/SOCC.aspx", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_2_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_3", "text": "Components", "icon": true, "li_attr": { "id": "j1_3", "url": "", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_3_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [{ "id": "j1_4", "text": "SOTG-15", "icon": true, "li_attr": { "id": "j1_4", "visibility": "Anonymous", "url": "app/SOTG1.aspx" }, "a_attr": { "href": "#", "id": "j1_4_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_6", "text": "SOTG-25", "icon": true, "li_attr": { "id": "j1_6", "visibility": "Anonymous", "url": "app/SOTG2.aspx" }, "a_attr": { "href": "#", "id": "j1_6_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_7", "text": "SOTG-35", "icon": true, "li_attr": { "id": "j1_7", "visibility": "Anonymous", "url": "app/SOTG3.aspx" }, "a_attr": { "href": "#", "id": "j1_7_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }], "type": "default" }, { "id": "j1_56", "text": "SOATG", "icon": true, "li_attr": { "id": "j1_56", "url": "app/SOATG.aspx", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_56_anchor" }, "state": { "loaded": true, "opened": true, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_9", "text": "EXCON (Private)", "icon": true, "li_attr": { "id": "j1_9", "visibility": "Anonymous", "url": "app/Excon.aspx" }, "a_attr": { "href": "#", "id": "j1_9_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_10", "text": "Battlespace", "icon": true, "li_attr": { "id": "j1_10", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_10_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [{ "id": "j1_13", "text": "Air Asset Tracker", "icon": true, "li_attr": { "id": "j1_13", "visibility": "Anonymous", "url": "app/airassets.aspx" }, "a_attr": { "href": "#", "id": "j1_13_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_14", "text": "Air Support Request", "icon": true, "li_attr": { "id": "j1_14", "visibility": "Anonymous", "url": "app/asr.aspx" }, "a_attr": { "href": "#", "id": "j1_14_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_15", "text": "Commanders Update Brief", "icon": true, "li_attr": { "id": "j1_15", "visibility": "Anonymous", "url": "app/cub.aspx" }, "a_attr": { "href": "#", "id": "j1_15_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_16", "text": "Communications Tracker", "icon": true, "li_attr": { "id": "j1_16", "visibility": "Anonymous", "url": "app/comms.aspx" }, "a_attr": { "href": "#", "id": "j1_16_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_18", "text": "Current Operations Summary", "icon": true, "li_attr": { "id": "j1_18", "visibility": "Anonymous", "url": "app/projection.aspx" }, "a_attr": { "href": "#", "id": "j1_18_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_19", "text": "Mission/CONOP Tracker", "icon": true, "li_attr": { "id": "j1_19", "visibility": "Anonymous", "url": "app/MissionTracker.aspx" }, "a_attr": { "href": "#", "id": "j1_19_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_20", "text": "Request for Information", "icon": true, "li_attr": { "id": "j1_20", "visibility": "Anonymous", "url": "app/rfi.aspx" }, "a_attr": { "href": "#", "id": "j1_20_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_55", "text": "SITREPs", "icon": true, "li_attr": { "id": "j1_55", "visibility": "Anonymous", "url": "app/sitreps.aspx" }, "a_attr": { "href": "#", "id": "j1_55_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }], "type": "default" }, { "id": "j1_11", "text": "Information", "icon": true, "li_attr": { "id": "j1_11", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_11_anchor" }, "state": { "loaded": true, "opened": true, "selected": false, "disabled": false }, "data": {}, "children": [{ "id": "j1_21", "text": "Announcements", "icon": true, "li_attr": { "id": "j1_21", "visibility": "Anonymous", "url": "app/announce.aspx" }, "a_attr": { "href": "#", "id": "j1_21_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_22", "text": "Calendar", "icon": true, "li_attr": { "id": "j1_22", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_22_anchor" }, "state": { "loaded": true, "opened": true, "selected": false, "disabled": false }, "data": {}, "children": [{ "id": "j1_31", "text": "Academics", "icon": true, "li_attr": { "id": "j1_31", "visibility": "Anonymous", "url": "Lists/EventCalendar/Academics.aspx" }, "a_attr": { "href": "#", "id": "j1_31_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_32", "text": "Battle Rhythm", "icon": true, "li_attr": { "id": "j1_32", "visibility": "Anonymous", "url": "Lists/EventCalendar/BattleRhythm.aspx" }, "a_attr": { "href": "#", "id": "j1_32_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_33", "text": "EXCON", "icon": true, "li_attr": { "id": "j1_33", "visibility": "Anonymous", "url": "Lists/EventCalendar/EXCON.aspx" }, "a_attr": { "href": "#", "id": "j1_33_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_37", "text": "SOCC-Intel", "icon": true, "li_attr": { "id": "j1_37", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOCCIntel.aspx" }, "a_attr": { "href": "#", "id": "j1_37_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_38", "text": "SOCC-Operations", "icon": true, "li_attr": { "id": "j1_38", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOCCOperations.aspx" }, "a_attr": { "href": "#", "id": "j1_38_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_39", "text": "SOCC-SIGCEN", "icon": true, "li_attr": { "id": "j1_39", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOCCSIGCEN.aspx" }, "a_attr": { "href": "#", "id": "j1_39_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_40", "text": "SOCC-SUPCEN", "icon": true, "li_attr": { "id": "j1_40", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOCCSUPCEN.aspx" }, "a_attr": { "href": "#", "id": "j1_40_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_45", "text": "SOATG", "icon": true, "li_attr": { "id": "j1_45", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOATG.aspx" }, "a_attr": { "href": "#", "id": "j1_45_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_46", "text": "SOTG-15", "icon": true, "li_attr": { "id": "j1_46", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOTG-15.aspx" }, "a_attr": { "href": "#", "id": "j1_46_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_47", "text": "SOTG-25", "icon": true, "li_attr": { "id": "j1_47", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOTG-25.aspx" }, "a_attr": { "href": "#", "id": "j1_47_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_48", "text": "SOTG-35", "icon": true, "li_attr": { "id": "j1_48", "visibility": "Anonymous", "url": "Lists/EventCalendar/SOTG-35.aspx" }, "a_attr": { "href": "#", "id": "j1_48_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_49", "text": "VTC", "icon": true, "li_attr": { "id": "j1_49", "visibility": "Anonymous", "url": "Lists/EventCalendar/VTC.aspx" }, "a_attr": { "href": "#", "id": "j1_49_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }], "type": "default" }, { "id": "j1_23", "text": "Event Documents", "icon": true, "li_attr": { "id": "j1_23", "visibility": "Anonymous", "url": "app/EvDoc.aspx" }, "a_attr": { "href": "#", "id": "j1_23_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [{ "id": "j1_62", "text": "Templates", "icon": true, "li_attr": { "id": "j1_62", "url": "EventDocuments/Forms/DocumentTemplates.aspx", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_62_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }], "type": "default" }, { "id": "j1_57", "text": "After Action Reports", "icon": true, "li_attr": { "id": "j1_57", "url": "Lists/AAR", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_57_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_24", "text": "Phonebook", "icon": true, "li_attr": { "id": "j1_24", "visibility": "Anonymous", "url": "app/Phone.aspx" }, "a_attr": { "href": "#", "id": "j1_24_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }], "type": "default" }, { "id": "j1_12", "text": "Support", "icon": true, "li_attr": { "id": "j1_12", "visibility": "Anonymous" }, "a_attr": { "href": "#", "id": "j1_12_anchor" }, "state": { "loaded": true, "opened": true, "selected": false, "disabled": false }, "data": {}, "children": [{ "id": "j1_26", "text": "Help Desk", "icon": true, "li_attr": { "id": "j1_26", "visibility": "Anonymous", "url": "app/HelpDesk.aspx" }, "a_attr": { "href": "#", "id": "j1_26_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }, { "id": "j1_27", "text": "Recycle Bin", "icon": true, "li_attr": { "id": "j1_27", "visibility": "Anonymous", "url": "_layouts/recyclebin.aspx" }, "a_attr": { "href": "#", "id": "j1_27_anchor" }, "state": { "loaded": true, "opened": false, "selected": false, "disabled": false }, "data": {}, "children": [], "type": "default" }], "type": "default" }], "type": "default" }];
            saveNavigation(data);
        }
    }

    function saveGlobalNavMenuItems(menuItems) {
        /*
        DEPRECATED: new approach no longer uses SPWeb object's property bag
        var rootWebProperties = null,
			ctx = SP.ClientContext.get_current(),
			web = ctx.get_web();

        ctx.load(web);
        rootWebProperties = web.get_allProperties();
        rootWebProperties.set_item("customGlobalNav", JSON.stringify(menuItems));
        web.update();
        ctx.load(web);
        ctx.executeQueryAsync(function () {
            alert("Navigation has been saved:  \n\n- Please instruct users to close and reopen their browsers");
            window.location.href = window.location.href;
        }, function (sender, args) {
            alert("Error occurred updating the PNT navigation:\n " + args.get_message());
        });
        */
    }
    
    function saveNavigation(menuItems) {
        //ASSUMES THAT: there is one and only one list item
        //ASSUMES THAT: the original list item (with List Item ID of 1) was not deleted...it just gets continually updated
        return $().SPServices({
            operation: "UpdateListItems",
            listName: "Navigation",
            ID: 1,
            valuepairs: [["JSON", JSON.stringify(menuItems)]]
        })
	    .then(function () {
	        alert("Success: Navigation has been saved:  \n\n- Please instruct users to close and reopen their browsers");
	    })
        .fail(function () {
            alert("Error: Could not save navigation");
        });
    }

    function signChopForm(signedForm) {
        return $().SPServices({
            operation: "UpdateListItems",
            batchCmd: "New",
            listName: "ConopChops",
            valuepairs: [
                ["Title", "Chop"],
                ["SignOnBehalfOf", signedForm.reviewer],
                ["Verdict", signedForm.reviewerChopStatus],
                ["ConopLibraryUrl", signedForm.libraryForConop],
                ["ConopID", signedForm.conopID],
                ["CommentsOnConop", signedForm.reviewerComments]
            ]
        })
		.then(function () {

		})
        .fail(function () {
            alert("Error: Could not sign chop at this time. Please try again later");
        });
    }

    //public API    
    return {
        copyMessageTrafficIntoMsel: copyMessageTrafficIntoMsel,
        getAirSupportRequests: getAirSupportRequests,
        getBattleRhythmForNext24Hours: getEventCalendar_Next24Hours,
        getCurentAnnouncements: getAnnouncements_Current,
        getCCIRS: getCCIRS,
        getCommStatuses: getCommStatuses,
        getConopChops: getConopChops,
        getHelpDeskTickets:  getHelpDeskTickets,
        getMissionDocuments: getMissionDocuments,
        getMissionDocumentsByType: getMissionDocumentsByType,
        getMissions: getMissions,
        getNavigation: getNavigation,
        getNodeStatuses: getNodeStatuses,
        //getGlobalNavMenuItems: getGlobalNavMenuItems,
        getOpenCollectionReqs: getRFI_OpenCollectionReqs,
        getSignifcantMessageTraffic: getMessageTraffic_Significant,
        getSignificantWatchlogEvents: getWatchlog_SignificantEvents,
        getStatusForRFI_Synch: getStatusForRFI_Synch,
        prepopulateWithDefaultNavMenuItems: prepopulateWithDefaultNavMenuItems,
        //saveGlobalNavMenuItems: saveGlobalNavMenuItems,
        saveNavigation: saveNavigation,
        signChopForm: signChopForm
    }
});


