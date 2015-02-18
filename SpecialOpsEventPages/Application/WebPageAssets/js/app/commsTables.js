define(function (require) {

    //dependencies
    var $ = require('jquery'),
        handlebars = require('handlebars');

    //Template
    var commStatusHtml =
		"<table class='commsStatusTable' border='1' style='border-collapse:collapse;'>\
    		<tr>\
    			<th>\
    				&nbsp;\
    			</th>\
    			<th colspan='4'>\
    				DATA\
    			</th>\
    			<th colspan='4'>\
    				VOICE\
    			</th>\
    			<th colspan='3'>\
    				VIDEO\
    			</th>\
    			<th>\
    				&nbsp;\
    			</th>\
    		</tr>\
    		<tr>\
    			<th>\
    				Element\
    			</th>\
       			<th>\
    				UNCLASS\
    			</th>\
    			<th>\
    				BICES\
    			</th>\
       			<th>\
    				SECRET\
    			</th>\
				<th>\
    				TS\
    			</th>\
       			<th>\
    				UNCLASS\
    			</th>\
				<th>\
    				BICES\
    			</th>\
       			<th>\
    				SECRET\
    			</th>\
    			<th>\
    				TACSAT\
    			</th>\
       			<th>\
    				BICES\
    			</th>\
				<th>\
    				SECRET\
    			</th>\
       			<th>\
    				TS\
    			</th>\
				<th>\
    				Comments\
    			</th>\
    		</tr>\
    		{{#each statuses}}\
    		<tr>\
    			<td>\
    				{{package}}\
    			</td>\
       			<td class='{{unclassData}}'>\
    				{{unclassData}}\
    			</td>\
    			<td class='{{bicesData}}'>\
    				{{bicesData}}\
    			</td>\
       			<td class='{{secretData}}'>\
    				{{secretData}}\
    			</td>\
				<td class='{{tsData}}'>\
    				{{tsData}}\
    			</td>\
       			<td class='{{unclassPhone}}'>\
    				{{unclassPhone}}\
    			</td>\
				<td class='{{bicesPhone}}'>\
    				{{bicesPhone}}\
    			</td>\
       			<td class='{{secretPhone}}'>\
    				{{secretPhone}}\
    			</td>\
    			<td class='{{tacsatRadio}}'>\
    				{{tacsatRadio}}\
    			</td>\
       			<td class='{{bicesVtc}}'>\
    				{{bicesVtc}}\
    			</td>\
				<td class='{{secretVtc}}'>\
    				{{secretVtc}}\
    			</td>\
       			<td class='{{tsVtc}}'>\
    				{{tsVtc}}\
    			</td>\
				<td>\
    				{{comments}}\
    			</td>\
    		</tr>\
    		{{/each}}\
            {{#if hasNoData}}\
            <tr>\
                <td colspan='13'  style='font-size:1em;'>There are no items to show in this view. To add a new item, click on the link \"Overall Communication Status\" above this table.</td>\
            </tr>\
            {{/if}}\
    	</table>";

    var nodeStatusHtml =
		"<table class='commsStatusTable' border='1' style='border-collapse:collapse;'>\
    		<tr>\
    			<th>\
    				Package\
    			</th>\
       			<th>\
    				Node#\
    			</th>\
    			<th>\
    				Status\
    			</th>\
				<th>\
    				Comments\
    			</th>\
    		</tr>\
    		{{#each statuses}}\
    		<tr>\
    			<td>\
    				{{package}}\
    			</td>\
       			<td>\
    				{{nodeNumber}}\
    			</td>\
       			<td class='{{status}}'>\
    				{{status}}\
    			</td>\
				<td style='white-space:nowrap;'>\
    				{{comments}}\
    			</td>\
    		</tr>\
    		{{/each}}\
            {{#if hasNoData}}\
            <tr>\
                <td colspan='4' style='font-size:1em;'>There are no items to show in this view. To add a new item, click on the link \"Node Status\" above this table.</td>\
            </tr>\
            {{/if}}\
    	</table>";

    var exposedAPI = {
        renderCommsTable: renderCommsTable,
        renderNodeStatusTable: renderNodeStatusTable
    }

    function renderCommsTable(container, data, editUrl) {
        var commStatusTemplate = handlebars.compile(commStatusHtml),
			commStatusTable = commStatusTemplate({
                hasNoData: (data.length === 0),
			    statuses: data
			});

        var table = $(commStatusTable);

        if (editUrl) {
            table.click(function () {
                window.location.href = _spPageContextInfo.webServerRelativeUrl + editUrl;
            });
            table.css({"cursor":"pointer"});
        }

        container.append(table);
    }

    function renderNodeStatusTable(container, data, editUrl) {
        var nodeStatusTemplate = handlebars.compile(nodeStatusHtml),
			nodeStatusTable = nodeStatusTemplate({
			    hasNoData: (data.length === 0),
			    statuses: data
			});

        var table = $(nodeStatusTable);

        if (editUrl) {
            table.click(function () {
                window.location.href = _spPageContextInfo.webServerRelativeUrl + editUrl;
            });
            table.css({ "cursor": "pointer" });
        }

        container.append(table);
    }

    return exposedAPI;
});
