import {Router} from "express";
import passport from "passport";
import login from "connect-ensure-login";
import server from "../../utils/oauth2";
import UserController from "../../controllers/user";


const router = Router(); // eslint-disable-line new-cap

router.route("/login")
	.post(passport.authenticate("local", {successReturnToOrRedirect: "/"}));

router.use((error, request, responce, next) => {
	void next; // eslint
	responce.redirect(`/login?alert=${error.reason}`);
});

router.route("/logout")
	.get((request, response) => {
		UserController.logout(request, response);
		response.redirect("/login");
	});

// user decision endpoint
//
// `decision` middleware processes a user"s decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.
router.route("/decision")
	.post(login.ensureLoggedIn(),
		server.decision()
	);


// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.
router.route("/oauth/token")
	.post(passport.authenticate(["basic", "oauth2-client-password"], {session: false}),
		server.token(),
		server.errorHandler()
	);

router.route("/userinfo")
	.get(passport.authenticate("bearer", {session: false}),
		(request, response) => {
			// request.authInfo is set using the `info` argument supplied by
			// `BearerStrategy`.  It is typically used to indicate scope of the token,
			// and used in access control checks.  For illustrative purposes, this
			// example simply returns the scope in the response.
			response.json({
				id: request.user._id,
				email: request.user.email,
				name: request.user.fullName,
				image: request.user.image,
				language: request.user.language,
				scope: request.authInfo.scope
			});
		}
	);

export default router;
