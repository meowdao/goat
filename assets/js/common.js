define(["require", "jquery", "globalize", "jquery-ui/selectmenu", "jquery-ui/button"], function (require, $, globalize) {
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
        /*$("[data-role]", context).each(function () {
            var self = $(this);
            self[self.data("role")](self.data("options"));
            self.removeAttr("data-role data-options");
        });*/
        $("select", context).each(function () {
            var self = $(this);
            self.selectmenu(self.data("options"));
            self.removeAttr("data-role data-options");
        });
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