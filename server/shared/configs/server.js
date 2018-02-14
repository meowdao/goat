export default {
	development: {
		// oauth2 doesn't work with self-signed certificate therefore no https
		// amazone s3 doesn't work with localhost subdomains therefore no office.localhost
		office: {
			protocol: "http",
			hostname: "localhost",
			port: 9000
		},
		oauth2: {
			protocol: "http",
			hostname: "localhost",
			port: 3000
		},
		cdn: {
			protocol: "http",
			hostname: "localhost",
			port: 5000
		}
	},
	production: {
		office: {
			protocol: "https",
			hostname: "example.com",
			port: 443
		},
		oauth2: {
			protocol: "https",
			hostname: "oauth2.example.com",
			port: 443
		},
		cdn: {
			protocol: "https",
			hostname: "cdn.example.com",
			port: 443
		}
	},
	staging: {
		office: {
			protocol: "http",
			hostname: "localhost",
			port: 9000
		},
		oauth2: {
			protocol: "http",
			hostname: "localhost",
			port: 3000
		},
		cdn: {
			protocol: "http",
			hostname: "localhost",
			port: 5000
		}
	},
	test: {
		office: {
			protocol: "http",
			hostname: "localhost",
			port: 9001
		},
		oauth2: {
			protocol: "http",
			hostname: "localhost",
			port: 3001
		},
		cdn: {
			protocol: "http",
			hostname: "localhost",
			port: 5001
		}
	}
};
