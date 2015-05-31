"use strict";

export default {
    development: {
	    mongo: {
		    url: "mongodb://localhost/goat",
		    options: {
			    server: {
				    socketOptions: {
					    keepalive: 1
				    }
			    }
		    }
	    },
	    strategies: {
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
			    callbackURL: "http://localhost:8888/auth/google/callback"
		    }
	    },
	    session: {
		    proxy: false,
		    secret: "keyboard_cat",
		    saveUninitialized: true,
		    resave: false,
		    rolling: true,
		    name: "goat.id",
		    cookie: {
			    path: "/",
			    httpOnly: true,
			    secure: false,
			    maxAge: 24 * 60 * 60 * 1000,
			    signed: false
		    }
	    }
    }
};
