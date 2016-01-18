"use strict";

export default {
	test: {
		mongo: {
			url: "mongodb://localhost/goat_test",
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
				callbackURL: "http://localhost:3000/auth/facebook/callback"
			},
			google: {
				clientID: "",
				clientSecret: "",
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
			self: {
				protocol: "http",
				hostname: "localhost",
				port: 3001
			},
			mailgun: {
				api_key: "", // eslint-disable-line camelcase
				domain: "",
				from: "G.O.A.T. <no-reply@goat.com>"
			},
			twilio: {
				AccountSID: "",
				AuthToken: "",
				from: "+15005550006" // https://www.twilio.com/docs/api/rest/test-credentials
			}
		}
	},
	development: {
		mongo: {
			url: "mongodb://localhost/goat_dev",
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
				callbackURL: "http://localhost:3000/auth/facebook/callback"
			},
			google: {
				clientID: "",
				clientSecret: "",
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
			self: {
				protocol: "http",
				hostname: "localhost",
				port: 3001
			},
			mailgun: {
				api_key: "", // eslint-disable-line camelcase
				domain: "",
				from: "G.O.A.T. <no-reply@goat.com>"
			},
			twilio: {
				AccountSID: "",
				AuthToken: "",
				from: ""
			},
			twitter: {
				consumer_key: "L4HqNsDwsUuNis6aTtB9W2QrK", // eslint-disable-line camelcase
				consumer_secret: "vjfl34COZGEpwUBfLp6dGCDQ6T2dfcR9ajgHbcaMkRrfp5jl9t", // eslint-disable-line camelcase
				access_token: "4727464692-4AebogQBWn55kGWT4jNPqkH6sunpWfHWDfEHndi", // eslint-disable-line camelcase
				access_token_secret: "E1uL5tJY7NJtW3YyZYGn1mDXBRSZiHWmVfjixaj5crYhb" // eslint-disable-line camelcase
			}
		}
	}
};
