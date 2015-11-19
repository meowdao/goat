"use strict";

import React from "react";
import EmailStore from "../../stores/EmailStore.js";

class Test extends React.Component {
	render () {
		let data = EmailStore.getData();
		return (
			<div>
				<p>Test email {JSON.stringify(data)}</p>
			</div>
		);
	}
}

export default Test;
