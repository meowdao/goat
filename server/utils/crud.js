import {wrapJSON} from "../routes/wrapper";
import {checkPermissions, checkFeatures, methodNotAllowed, validateParams, params} from "../routes/utils";


export default function (router, controller, {object, prefix, permission = "", feature = ""}) {
	router.route(`/${object}`)
		.get(checkPermissions(prefix, permission, "read"), checkFeatures(prefix, feature), validateParams([params.page, params.pageSize], "query"), wrapJSON(::controller.list))
		.post(checkPermissions(prefix, permission, "create"), checkFeatures(prefix, feature), wrapJSON(::controller.insert))
		.all(methodNotAllowed);

	router.route(`/${object}/:${controller.constructor.param}`)
		.get(checkPermissions(prefix, permission, "read"), checkFeatures(prefix, feature), wrapJSON(::controller.getById))
		.put(checkPermissions(prefix, permission, "update"), checkFeatures(prefix, feature), wrapJSON(::controller.edit))
		.delete(checkPermissions(prefix, permission, "delete"), checkFeatures(prefix, feature), wrapJSON(::controller.delete))
		.all(methodNotAllowed);
}

