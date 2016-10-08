import crud from "../../../utils/crud";
import CategoryController from "../../../controllers/blog/category";

export default function (router) {
	crud(router, new CategoryController(), {object: "categories"});
}
