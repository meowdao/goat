define(["jquery-ui.js/datepicker"], function (datepicker) {
    "use strict";

    $.datepicker.setDefaults($.datepicker.regional[""]);

    return datepicker;
});