/* eslint no-use-before-define:0 */

import {getRandomString} from "../misc.js";
import {password, confirm, phoneNumber} from "./misc.js";


export function hashObject(data) {
	return Object.assign({
		token: getRandomString(20)
	}, data);
}

export function locationObject(data) {
	return Object.assign({
		streetAddress: "very long street 123",
		tag: "tag",
		city: "city",
		state: "state",
		country: "country",
		zipCode: "00000",
		location: {
			type: "Point",
			coordinates: [Math.random(), Math.random()]
		}
	}, data);
}

export function organizationObject(data) {
	return Object.assign({
		companyName: "Organization name",
		domainName: `${getRandomString(10).toLowerCase()}.org.com`,
		phoneNumber,
		email: `trejgun+organization+${getRandomString(10).toLowerCase()}@gmail.com`,
		location: locationObject(),
		preferences: {
			features: {
				coupons: true,
				guides: true,
				questions: true
			},
			customFields: {
				notes: "Notes",
				prior: 30
			},
			widget: {
				display: {
					event: {
						cutoff: 2880,
						isSiteWide: true
					},
					theme: "blue",
					timeslot: {
						availability: true,
						duration: true,
						price: true,
						startTime: true
					}
				}
			}
		},
		social: {
			facebook: "http://facebook/",
			instagram: "http://instagram/",
			tripadvisor: "http://tripadvisor/",
			twitter: "http://twitter/"
		}
	}, data);
}

export function userObject(data) {
	return Object.assign({
		confirm,
		email: `trejgun+user+${getRandomString(10).toLowerCase()}@gmail.com`,
		fullName: "Trej Gun",
		location: locationObject(),
		password,
		phoneNumber,
		role: "admin"
	}, data);
}
