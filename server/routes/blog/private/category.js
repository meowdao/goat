import {wrapJSON} from "../../wrapper";
import {methodNotAllowed} from "../../utils";
import CategoryController from "../../../controllers/blog/category";


export default function (router) {
	const categoryController = new CategoryController();

	router.route("/categories")
		.get(wrapJSON(::categoryController.list))
		.post(wrapJSON(::categoryController.insert))
		.all(methodNotAllowed);

	router.route("/categories/:_id")
		.get(wrapJSON(::categoryController.getById))
		.put(wrapJSON(::categoryController.edit))
		.delete(wrapJSON(::categoryController.delete))
		.all(methodNotAllowed);
}
