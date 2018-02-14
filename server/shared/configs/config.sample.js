import server from "./server";
import {formatUrl} from "../../../shared/utils/misc";


export default {
	[process.env.NODE_ENV]: {
		rendering: "server",
		createUser: true,
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
				callbackURL: `${formatUrl(server[process.env.NODE_ENV][process.env.MODULE])}/api/auth/facebook/callback`,
				profileFields: ["id", "birthday", "email", "gender", "link", "name", "locale", "picture"]
			},
			google: {
				clientID: "",
				clientSecret: "",
				callbackURL: `${formatUrl(server[process.env.NODE_ENV][process.env.MODULE])}/api/auth/google/callback`
			},
			system: {
				clientID: `goat-${process.env.NODE_ENV}-server`,
				clientSecret: "01123581321345589144233377610",
				callbackURL: `${formatUrl(server[process.env.NODE_ENV][process.env.MODULE])}/api/auth/system/callback`,
				authorizationURL: `${formatUrl(server[process.env.NODE_ENV].oauth2)}/authorize`,
				tokenURL: `${formatUrl(server[process.env.NODE_ENV].oauth2)}/api/oauth/token`,
				profileURL: `${formatUrl(server[process.env.NODE_ENV].oauth2)}/api/userinfo`
			}
		},
		session: {
			proxy: false,
			secret: "keyboard_cat",
			saveUninitialized: true,
			resave: false,
			rolling: true,
			name: "goat",
			cookie: {
				path: "/",
				httpOnly: true,
				secure: false,
				maxAge: 24 * 60 * 60 * 1000,
				signed: false
			}
		},
		s3: {
			bucket: `goat-${process.env.NODE_ENV}`,
			region: "us-east-1",
			s3Options: {
				accessKeyId: "",
				secretAccessKey: ""
			}
		},
		ses: {
			region: "us-east-1",
			sesOptions: {
				accessKeyId: "",
				secretAccessKey: ""
			}
		}
	}
};
