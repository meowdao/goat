import AbstractController from "../../shared/controllers/abstract";


export default class TokenController extends AbstractController {
	static realm = "mail";

	static types = {
		email: "email",
		password: "password"
	};
}
