import supertest from "supertest";
import passport from "passport-stub";


const apps = {};

export default function superTestWrapper(name) {
	before(() => {
		process.env.MODULE = name;
	});

	if (!apps[name]) {
		process.env.MODULE = name;

		const app = require(`../server/${name}`).default;
		app._router = app.router;
		passport.install(app);

		apps[name] = supertest(app);

		apps[name].login = function login(user) {
			passport.login(user);
			return this;
		};
	}

	return apps[name];
}
