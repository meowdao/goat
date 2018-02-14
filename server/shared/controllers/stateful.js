import {checkModel, checkActive, checkOrganization} from "./middleware";
import CRUDController from "./crud";
import {paginate} from "../utils/response";
import {setStatus} from "../utils/request";
import {getConnections} from "../../shared/utils/mongoose";


export default class StatefulController extends CRUDController {
	static statuses = {
		active: "active",
		inactive: "inactive"
	};

	getByUId(request, {populate = [], ...options} = {}, conditions = []) {
		Object.assign(options, {populate: [{
			path: "organizations",
			model: getConnections().oauth2.model("Organization")
		}].concat(populate)});
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]
		}, options)
			.tap(this.conditions(request, [checkModel(), checkOrganization()].concat(conditions)));
	}

	deactivate(request, options = {}, conditions = []) {
		Object.assign(options, {lean: false});
		return this.getByUId(request, options, [checkActive()].concat(conditions))
			.then(item => {
				item.set("status", this.constructor.statuses.inactive);
				return this.save(item);
			});
	}

	list(request, response) {
		const clean = {organizations: request.user.organization};
		setStatus(request, clean, this.constructor);
		return paginate(request, response, this, clean);
	}
}
