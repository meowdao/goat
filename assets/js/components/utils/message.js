"use strict";

import React from "react";

export default React.createClass({
	render: function () {
		return (
			<div>
				{this.props.messages && this.props.messages.forEach((message) => <div className="alert alert-success" role="alert">{message}</div>)}
				{this.props.notifications && this.props.notifications.forEach((message) => <div className="alert alert-warning" role="alert">{message}</div>)}
				{this.props.errors && this.props.errors.forEach((message) => <div className="alert alert-danger" role="alert">{message}</div>)}
			</div>
		);
	}
});
