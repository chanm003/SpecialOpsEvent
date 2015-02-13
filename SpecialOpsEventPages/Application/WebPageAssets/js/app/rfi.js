define(function (require) {

    //dependencies
    var $ = require('jquery'),
        jqueryui = require('jqueryui'),
        commonUI = require('app/commonUI');
    
    var exposedAPI = {
        render: render
    }

    function render() {
        $("#tabs")
            .tabs({
                active: commonUI.getActiveJqueryTabFromUrlHash(),
                activate: commonUI.changeUrlHashWhenJqueryTabSelected
            })
            .fadeIn();
    }



    return exposedAPI;
});
