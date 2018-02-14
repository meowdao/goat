import passport from "passport";
import {Router} from "express";

import UserController from "../../oauth2/controllers/user";


passport.serializeUser((user, callback) => callback(null, user._id));

passport.deserializeUser((_id, callback) => {
	const userController = new UserController();
	return userController.getByQuery({_id}, {lean: false})
		.then(user => callback(null, user))
		.catch(error => callback(error, null));
});

const router = Router(); // eslint-disable-line new-cap

router.use(passport.initialize());
router.use(passport.session());

export default router;
