"use strict";

var regexp = require("../utils/regexp.js"),
    mongoose = require("mongoose"),
    search = require("mongoose-text-search"),
    Schema = mongoose.Schema,
    crypto = require("crypto");

var User = new Schema({
    email: {type: String, unique: true, match: regexp.email},
    first_name: String,
    last_name: String,
    role: { type: String, enum: ["user", "admin"] },

    hashed_password: {type: String, select: false},
    salt: {type: String, select: false},

    date: {
        _id: false,
        created: {type: Date, default: Date.now}
    },

    facebook: {type: Schema.Types.Mixed, select: false},
    google: {type: Schema.Types.Mixed, select: false}

}, { collection: "test_user", versionKey: false});

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

User.path("email").validate(function (email) {
    return regexp.email.test(email);
}, "Email is invalid");

User.path("hashed_password").validate(function () {
    return regexp.lower.test(this._password);
}, "Passwords should contains lower case letters");

User.path("hashed_password").validate(function () {
    return regexp.upper.test(this._password);
}, "Passwords should contains upper case letters");

User.path("hashed_password").validate(function () {
    return regexp.numbers.test(this._password);
}, "Passwords should contains numbers");

User.path("hashed_password").validate(function () {
    return this._password === this._confirm;
}, "Passwords doesn't much");

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

User.plugin(search);
User.index({
    name: "text"
}, {
    name: "search",
    weights: {
        name: 1
    }
});

mongoose.model("User", User);