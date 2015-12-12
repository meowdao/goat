"use strict";

import React from "react";
import EmailStore from "../../stores/EmailStore.js";

export default class Verification extends React.Component {
	render() {
		let url = EmailStore.getUrl();
		let data = EmailStore.getData();
		return (
			<div>
				<p><a href={url + "user/verify/" + data.hash.token}>Verify email</a></p>
			</div>
		);
	}
}

