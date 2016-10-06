import {checkModel, checkActive, checkOrganization} from "../../utils/middleware";
import AbstractController from "./abstract";
import {paginate} from "../../utils/response";
import {setStatus} from "../../utils/request";
import {getConnections} from "../../utils/mongoose";


export default class StatefulController extends AbstractController {

	static statuses = {
		active: "active",
		inactive: "inactive"
	};

	getByUId(request, {populate = [], ...options} = {}, conditions = []) {
		Object.assign(options, {populate: [{
			path: "organizations",
			model: getConnections().user.model("Organization")
		}].concat(populate)});
		return this.findOne({
			[this.constructor.param]: request.params[this.constructor.param] || request.body[this.constructor.param]
		}, options)
			.then(this.conditions(request, [checkModel(), checkOrganization()].concat(conditions)));
	}

	deactivate(request, {lean = false, ...options} = {}, conditions = []) {
		Object.assign(options, {lean: false});
		return this.getByUId(request, options)
			.then(this.conditions(request, [checkActive(false)].concat(conditions)))
			.then(item => {
				item.set("status", this.constructor.statuses.inactive);
				return this.save(item);
			});
	}

	list(request, response) {
		const clean = {organizations: request.user.apiKey.organization._id};
		setStatus(request, clean, this.constructor);
		return paginate(request, response, this, clean);
	}

}
