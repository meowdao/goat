"use strict";

import crypto from "crypto";
import {Schema} from "mongoose";
import regexp from "../utils/regexp.js";

// last is first
var password_validator = [
    {
        validator: function () {
            return this._password === this._confirm;
        },
        msg: "Passwords doesn't much"
    },
    {
        validator: function () {
            return regexp.numbers.test(this._password);
        },
        msg: "Passwords should contains numbers"
    },
    {
        validator: function () {
            return regexp.upper.test(this._password);
        },
        msg: "Passwords should contains upper case letters"
    },
    {
        validator: function () {
            return regexp.lower.test(this._password);
        },
        msg: "Passwords should contains lower case letters"
    },
    {
        validator: function () {
            return !!this._password;
        },
        msg: "Password cannot be blank"
    }
];

var User = new Schema({
    avatar: {type: Schema.Types.ObjectId, ref: "Avatar"},

    email: {type: String, unique: true, required: "Email cannot be blank", match: [regexp.email, "Email is invalid"]},
    email_verified: {type: Boolean, default: false},

    first_name: {type: String, required: "First name cannot be blank"},
    last_name: {type: String, required: "Last name cannot be blank"},

    role: { type: String, default: "user", enum: ["user", "admin"] },

    hashed_password: {type: String, select: false, validate: password_validator},
    salt: {type: String, select: false},

    date: {
        _id: false,
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now}
    },

    facebook: {type: Schema.Types.Mixed, select: false},
    google: {type: Schema.Types.Mixed, select: false}

}, { collection: "test_user", versionKey: false});

User
    .virtual("full_name")
    .get(function () {
        return this.first_name + " " + this.last_name;
    });

User
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

User
    .virtual("confirm")
    .set(function (password) {
        this._confirm = password;
    })
    .get(function () {
        return this._confirm;
    });

User
    .pre("save", function (next) {
        var now = new Date();
        this.date.created = now;
        if (!this.date.created) {
            this.date.created = now;
        }
        next();
    });

User.methods = {

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + "";
    },

    encryptPassword: function (password) {
        if (!password) {
            return "";
        }
        var encrypred;
        try {
            encrypred = crypto.createHmac("sha1", this.salt).update(password).digest("hex");
            return encrypred;
        } catch (error) {
            console.error(error);
            return "";
        }
    }
};

User.index({
    name: "text"
}, {
    name: "search",
    weights: {
        name: 1
    }
});

module.exports = User;