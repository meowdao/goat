import q from "q";
import {pick} from "lodash";
import {setRegExp} from "../../utils/request";
import {getNewId} from "../../utils/mongoose";

import AbstractController from "../abstract/abstract";


export default class LocationController extends AbstractController {

	static realm = "user";

	edit(request, object) {
		if (!request.body.location) {
			if (request.body.location === null) {
				return q(null);
			} else {
				return q(object && object.location || null);
			}
		}

		const clean = Object.assign({}, pick(request.body.location, ["city", "country", "countryCode", "location", "state", "stateCode", "streetAddress", "tag", "zipCode"]));
		clean.location.type = clean.location.type || "Point";
		return this.upsert({_id: object.location || request.body.location._id || getNewId()}, clean, {lean: false});
	}

	getIds(request) {
		const query = request.query || request.body;

		const clean = {};

		setRegExp(request, clean, ["city", "state"]);

		if (query.country) {
			clean.country = query.country;
		}

		if (query.lat && query.lng) {
			clean.location = {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [query.lat, query.lng]
					},
					$maxDistance: (parseInt(query.distance, 10) * (/mi/.test(query.distance) ? 1.609344 : 1)) || 30000
				}
			};
		}
		if (!Object.keys(clean).length) {
			return q(null);
		} else {
			return this.distinct("_id", clean);
		}
	}

	insert(request) {
		if (!request.body.location) {
			return q(null);
		}

		return this.create(pick(request.body.location, ["city", "country", "countryCode", "location", "state", "stateCode", "streetAddress", "tag", "zipCode"]));
	}

}
