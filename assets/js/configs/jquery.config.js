define(["jquery", "globalize"], function ($, globalize) {
    "use strict";

    $.ajaxSetup({
        type: "post",
        dataType: "json",
        cache: false,
        author: "\x63\x74\x61\x70\x62\x69\x75\x6D\x61\x62\x70\x40\x67\x6D\x61\x69\x6C\x2E\x63\x6F\x6D"
    });

    $(document)
        .ajaxStart(function () {
            $(this).css({cursor: "wait"});
            // TODO move to mobile config
            if ($.mobile) {
                $.mobile.loading("show", {
                    text: globalize.translate("common/loading"),
                    textVisible: true,
                    theme: "a",
                    html: ""
                });
            }
        })
        .ajaxError(function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            console.info(document.location.protocol + "//" + document.location.host + "/" + ajaxOptions.url + "?" + (ajaxOptions.data || ""));
            console.error(thrownError);
            showError(thrownError);
        })
        .ajaxSuccess(function (event, XMLHttpRequest, ajaxOptions) {
            console.info(document.location.protocol + "//" + document.location.host + "/" + ajaxOptions.url + "?" + (ajaxOptions.data || ""));
        })
        .ajaxComplete(function () {
            $(this).css({cursor: "auto"});
            // TODO move to mobile config
            if ($.mobile) {
                $.mobile.loading("hide");
            }
        });
    
    return $.noConflict(true);
});