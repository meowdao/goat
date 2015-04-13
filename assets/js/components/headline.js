"use strict";

import React from "react";

export default React.createClass({
	render: function () {
		return (
			<div className="page-header">
				<h1>{this.props.text}</h1>
			</div>
		);
	}
});
