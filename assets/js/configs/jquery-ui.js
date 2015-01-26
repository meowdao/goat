define(["jquery", "globalize", "jquery-ui", "css!jquery-ui"], function ($, globalize) {
    "use strict";

    //$.datepicker.setDefaults($.datepicker.regional["en" || i18n.lang]); // TODO FIX ME

    $.extend($.ui.dialog.prototype.options, {
        modal: true,
        resizable: false,
        draggable: false,
        autoOpen: false,
        closeText: globalize.translate("common/close")
    });


    //$("input[type=submit], input[type=reset], input[type=button], button, a[data-role=button]", document).button();

    /*$("[data-role]", context).each(function () {
     var self = $(this);
     self[self.data("role")](self.data("options"));
     self.removeAttr("data-role data-options");
     });*/

    $("select", document).each(function () {
        var self = $(this);
        self.selectmenu(self.data("options"));
        self.removeAttr("data-role data-options");
    });

    $("input[type=submit]", document).button();

    return $.ui;

});