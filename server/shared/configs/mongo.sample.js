const config = {
	development: {
		office: {
			url: "localhost",
			user: "",
			pass: ""
		},
		oauth2: {
			url: "localhost",
			user: "",
			pass: ""
		},
		mail: {
			url: "localhost",
			user: "",
			pass: ""
		}
	}
};

export default ["mail", "oauth2", "office"].reduce((memo, module) =>
	Object.assign(memo, {
		[module]: {
			url: `mongodb://${config[process.env.NODE_ENV][module].url}/goat-${process.env.NODE_ENV}-${module}`,
			options: {
				server: {
					// https://gist.github.com/mongolab-org/9959376
					socketOptions: {
						autoReconnect: true,
						keepAlive: 300000,
						connectTimeoutMS: 30000
					}
				},
				user: config[process.env.NODE_ENV][module].user,
				pass: config[process.env.NODE_ENV][module].pass
			}
		}
	}), {});
