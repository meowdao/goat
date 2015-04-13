"use strict";

export default {
    development: {
        mongoUrl: "mongodb://localhost/goat",
        passport: {
            local: {
                usernameField: "email",
                passwordField: "password"
            },
            facebook: {
                clientID: "",
                clientSecret: "",
                callbackURL: ""
            },
            google: {
                clientID: "",
                clientSecret: "",
                callbackURL: ""
            }
        }
    }
};