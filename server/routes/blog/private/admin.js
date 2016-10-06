import {wrapJSON} from "../../wrapper";
import {methodNotAllowed, validateParams, params} from "../../utils";
import UserController from "../../../controllers/user/user";

export default function (router) {
	const userController = new UserController();

	router.route("/users")
		.get(validateParams([params.page, params.pageSize], "query"), wrapJSON(::userController.list))
		.post(wrapJSON(::userController.insert));

	router.route("/users/:_id")
		.get(wrapJSON(::userController.getById))
		.put(wrapJSON(::userController.edit))
		.delete(wrapJSON(::userController.delete))
		.all(methodNotAllowed);
}
