"use strict";

import _ from "lodash";
import mongoose from "mongoose";

import AbstractController from "../utils/controller.js";
import messager from "../utils/messager.js";

var Controller = new AbstractController(mongoose.model("Hash"));

var methods = {
    getByIdAndDate: function (id) {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        return Controller.findOne({
            _id: id,
            "date.created": {$gte: date}
        })
            .then(messager.checkModel("expired-key"));
    }
};

export default _.extend(Controller, methods);

