define(["jquery","jquery-ui/dialog","globalize"], function ($, dialog,globalize) {
    "use strict";

    $.extend(dialog.prototype.options, {
        modal: true,
        resizable: false,
        draggable: false,
        autoOpen: false,
        closeText: globalize.translate("common/close")
    });

    return dialog;
});