export default {
	[process.env.NODE_ENV]: {
		realm: "user",
		rendering: "server",
		mongo: {
			blog: {
				url: "mongodb://localhost/goat-blog",
				options: {
					server: {
						socketOptions: {
							keepalive: 1
						}
					}
				}
			},
			user: {
				url: "mongodb://localhost/goat-user",
				options: {
					server: {
						socketOptions: {
							keepalive: 1
						}
					}
				}
			},
			mail: {
				url: "mongodb://localhost/goat-mail",
				options: {
					server: {
						socketOptions: {
							keepalive: 1
						}
					}
				}
			}
		},
		redis: {
			port: 6379,
			host: "localhost"
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
			},
			goat: {
				clientID: "goat-test-server",
				clientSecret: "01123581321345589144233377610",
				callbackURL: "http://localhost:9000/api/auth/goat/callback",
				authorizationURL: "http://localhost:3000/dialog/authorize",
				tokenURL: "http://localhost:3000/oauth/token",
				profileURL: "http://localhost:3000/api/userinfo"
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
			protocol: "http",
			hostname: "localhost",
			port: 8080
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
		},
		twitter: {
			consumer_key: "", // eslint-disable-line camelcase
			consumer_secret: "", // eslint-disable-line camelcase
			access_token: "", // eslint-disable-line camelcase
			access_token_secret: "" // eslint-disable-line camelcase
		}
	}
};
