define(["require", "jquery", "globalize"], function (require, $, globalize) {
    "use strict";

    function showPopup (header, text, buttons) {
        if ($.mobile) {
            $("<div/>", {
                "class": "dispatch-popup",
                append: [
                    $("<h2/>", {text: header}),
                    $("<p/>", {text: text}),
                    $("<div/>", {
                        "class": "ui-grid-" + ["0", "0", "a", "b", "c", "d", "e"][buttons.length],
                        append: $.map(buttons, function (button, index) {
                            return $("<div/>", {
                                "class": "ui-block-" + ["a", "b", "c", "d", "e"][index],
                                append: $("<a/>", button).button()
                            });
                        })
                    })
                ]
            }).popup().on("popupafterclose", function () {
                $(this).popup("destroy");
            }).popup("open");
        } else if ($.ui) {
            $("<div/>", {
                append: $("<p/>", {text: text})
            }).dialog({
                title: header,
                autoOpen: true,
                buttons: buttons,
                close: function () {
                    $(this).dialog("destroy");
                }
            });
        } else {
            window.alert(text);
        }
    }

    function showError (error) {
        console.log(error);
        showPopup(globalize.translate("common/error"), error, [
            {
                text: globalize.translate("common/ok"),
                click: function () {
                    if ($.mobile) {
                        $(this).closest(".ui-popup").popup("close");
                    } else if ($.ui) {
                        $(this).dialog("close");
                    }
                }
            }
        ]);
    }

    function widgetize (context) {
        context = context || document;
        $("input[type=submit], input[type=reset], input[type=button], button, a[data-role=button]", context).button();
        $("[data-role]", context).each(function () {
            var self = $(this);
            self[self.data("role")](self.data("options"));
            self.removeAttr("data-role data-options");
        });
        if ($.ui.selectmenu) {
            $("select", context).each(function () {
                var self = $(this);
                self.selectmenu(self.data("options"));
                self.removeAttr("data-role data-options");
            });
        }
    }

    if ($.mobile) {
        // Turn off AJAX for local file browsing
        // https://github.com/jquery/jquery-mobile/blob/master/demos/_assets/js/jqm-demos.js
        if (location.protocol.substr(0, 4) === "file" ||
            location.protocol.substr(0, 11) === "*-extension" ||
            location.protocol.substr(0, 6) === "widget") {

            // Start with links with only the trailing slash and that aren't external links
            var fixLinks = function () {
                $("a[href$='/'], a[href='.'], a[href='..']").not("[rel='external']").each(function () {
                    this.href = $(this).attr("href").replace(/\/$/, "") + "/index.html";
                });
            };

            // fix the links for the initial page
            $(fixLinks);

            // fix the links for subsequent ajax page loads
            $(document).bind("pagecreate", fixLinks);

            // Check to see if ajax can be used. This does a quick ajax request and blocks the page until its done
            $.ajax({
                url: ".",
                async: false,
                isLocal: true
            }).error(function () {
                // Ajax doesn't work so turn it off
                $(document).bind("mobileinit", function () {
                    $.mobile.ajaxEnabled = false;
                });
            });
        }
    }

    $(function () {

        // js hint
        void showError;

        if ($.ui) {
            widgetize();
        }

        if ($.mobile) {
            $("a[data-submit='true']").on("click", function () {
                $(this).closest("form").submit();
            });
        }
    });

});