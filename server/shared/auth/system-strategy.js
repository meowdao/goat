import {Strategy as OAuth2Strategy, InternalOAuthError} from "passport-oauth2";

import configs from "../../shared/configs/config";

export default class SystemStrategy extends OAuth2Strategy {
	name = "system";

	userProfile(accessToken, callback) {
		const config = configs[process.env.NODE_ENV];
		this._oauth2.get(config.strategies.system.profileURL, accessToken, (err, body) => {
			if (err) {
				callback(new InternalOAuthError("failed to fetch user profile", err));
			} else {
				try {
					const json = JSON.parse(body);
					const profile = {
						provider: "system",
						id: json.id,
						displayName: json.name,
						emails: [{value: json.email}],
						photos: [{value: json.image}],
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
