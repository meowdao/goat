import superTestAsPromise from "supertest-as-promised";
import passport from "passport-stub";
import {getRandomInt} from "../../server/utils/misc";

const apps = {};

export default function superTestWrapper(name) {
	if (!apps[name]) {
		process.env.PORT = getRandomInt(1000, 2000);

		const app = require(`../../server/${name}`).default;
		passport.install(app);

		apps[name] = superTestAsPromise(app);

		apps[name].login = function login(user) {
			passport.login(user);
			return this;
		};
	}

	return apps[name];
}
