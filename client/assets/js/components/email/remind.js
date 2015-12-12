"use strict";

import React from "react";
import EmailStore from "../../stores/EmailStore.js";

export default class Remind extends React.Component {
	render() {
		let url = EmailStore.getUrl();
		let data = EmailStore.getData();
		return (
			<div>
				<p><a href={url + "/user/change/" + data.hash.token}>Change your password</a></p>
			</div>
		);
	}
}

