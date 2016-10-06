import passport from "passport";

import UserController from "../controllers/user/user";


export default function login(app) {
	passport.serializeUser((user, callback) => {
		callback(null, user._id);
	});

	passport.deserializeUser((_id, callback) => {
		const userController = new UserController();
		userController.getByQuery({_id})
			.then(user => {
				callback(null, user);
			})
			.catch(error => {
				callback(error, null);
			})
			.done();
	});

	app.use(passport.initialize());
	app.use(passport.session());
}
