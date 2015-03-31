define(["jquery", "globalize", "jquery-mobile", "css!jquery-mobile"], function ($, jqm, globalize) {
    "use strict";

    $(document)
        .on("mobileinit", function () {

            $.mobile.ajaxEnabled = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.pushStateEnabled = false;
            $.mobile.linkBindingEnabled = false;

            // use ? $.mobile.autoInitializePage = false;

            $.mobile.defaultDialogTransition = "none";
            $.mobile.defaultPageTransition = "slidedown";
            $.mobile.page.prototype.options.degradeInputs.date = true;
            $.mobile.page.prototype.options.domCache = false;

            //enable flag to disable rendering
            // $.mobile.ignoreContentEnabled=true;
            $.mobile.pushStateEnabled = true;
            $.mobile.phonegapNavigationEnabled = true;

            // enable loading page+icon
            $.mobile.loader.prototype.options.text = "loading";
            $.mobile.loader.prototype.options.textVisible = false;
            $.mobile.loader.prototype.options.theme = "a";
            $.mobile.loader.prototype.options.html = "";

        });

    $(document)
        .ajaxStart(function () {
            $.mobile.loading("show", {
                text: globalize.translate("common/loading"),
                textVisible: true,
                theme: "a",
                html: ""
            });
        })
        .ajaxComplete(function () {
            $.mobile.loading("hide");
        });

    // Turn off AJAX for local file browsing
    // https://github.com/jquery/jquery-mobile/blob/master/demos/_assets/js/jqm-demos.js
    if (location.protocol.substr(0, 4) === "file" ||
        location.protocol.substr(0, 11) === "*-extension" ||
        location.protocol.substr(0, 6) === "widget") {

        // Start with links with only the trailing slash and that aren't external links
        var fixLinks = function () {
            $("a[href$='/'], a[href='.'], a[href='..']").not("[rel='external']").each(function () {
                if (!$(this).attr("href").match("http")) {
                    this.href = $(this).attr("href").replace(/\/$/, "") + "/index.html";
                }
            });
        };

        // Fix the links for the initial page
        $(fixLinks);

        // Fix the links for subsequent ajax page loads
        $(document).on("pagecreate", fixLinks);

        // Check to see if ajax can be used. This does a quick ajax request and blocks the page until its done
        $.ajax({
            url: ".",
            async: false,
            isLocal: true
        }).error(function () {
            // Ajax doesn't work so turn it off
            $(document).on("mobileinit", function () {
                $.mobile.ajaxEnabled = false;

                var message = $('<div>', {
                    'class': "jqm-content",
                    style: "border:none; padding: 10px 15px; overflow: auto;",
                    'data-ajax-warning': true
                });

                message
                    .append("<h3>Note: Navigation may not work if viewed locally</h3>")
                    .append("<p>The Ajax-based navigation used throughout the jQuery Mobile docs may need to be viewed on a web server to work in certain browsers. If you see an error message when you click a link, please try a different browser.</p>");

                $(document).on("pagecreate", function (event) {
                    $(event.target).append(message);
                });
            });
        });
    }

    return jqm;

});