import {Router} from "express";
import {wrapJSON} from "../../../shared/utils/wrapper";
import {methodNotAllowed, checkPermissions} from "../../../shared/utils/middleware";
import UserController from "../../../oauth2/controllers/user";

const router = Router(); // eslint-disable-line new-cap
const userController = new UserController();

router.route("/sync")
	.get(wrapJSON(::userController.sync))
	.all(methodNotAllowed);

router.route("/users/typeahead")
	.get(wrapJSON(::userController.typeahead))
	.all(methodNotAllowed);

router.route("/users")
	.post(checkPermissions("users:create"), wrapJSON(::userController.insert))
	.get(checkPermissions("users:read"), wrapJSON(::userController.list))
	.all(methodNotAllowed);

router.route("/users/:_id")
	.get(checkPermissions("users:read"), wrapJSON(::userController.getById))
	.put(checkPermissions("users:update"), wrapJSON(::userController.edit))
	.delete(checkPermissions("users:delete"), wrapJSON(::userController.edit))
	.all(methodNotAllowed);

export default router;
