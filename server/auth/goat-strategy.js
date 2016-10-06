import {Strategy as OAuth2Strategy} from "passport-oauth2";
import {InternalOAuthError} from "passport-oauth";

import configs from "../configs/config";

export default class GOATStrategy extends OAuth2Strategy {

	name = "goat";

	userProfile(accessToken, callback) {
		const config = configs[process.env.NODE_ENV];
		this._oauth2.get(config.strategies.goat.profileURL, accessToken, (err, body) => {
			if (err) {
				callback(new InternalOAuthError("failed to fetch user profile", err));
			} else {
				try {
					const json = JSON.parse(body);
					const profile = {
						provider: "goat",
						id: json.id,
						displayName: json.name,
						emails: [{value: json.email}],
						_raw: body,
						_json: json
					};
					callback(null, profile);
				} catch (e) {
					callback(e);
				}
			}
		});
	}
}
