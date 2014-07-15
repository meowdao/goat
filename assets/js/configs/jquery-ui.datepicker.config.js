define(["jquery-ui/datepicker"], function (datepicker) {
    "use strict";

    $.datepicker.setDefaults($.datepicker.regional[""]);

    return datepicker;
});