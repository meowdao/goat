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
				clientID: "884111858371676",
				clientSecret: "f167fc2daa4d2887ebe1a9a0bfb52c1d",
				callbackURL: "http://localhost:3000/auth/facebook/callback"
			},
			google: {
				clientID: "451759059572.apps.googleusercontent.com",
				clientSecret: "6I3MjJS1AWDOOsMQy6joeasg",
				callbackURL: "http://localhost:3000/auth/google/callback"
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
	    },
	    server: {
		    smtp: {
			    from: "no-reply@example.com"
		    }
	    }
    }
};
