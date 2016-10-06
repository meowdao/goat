import AbstractController from "../abstract/abstract";


export default class HashController extends AbstractController {

	static realm = "mail";

	static types = {
		email: "email",
		password: "password"
	};

}
