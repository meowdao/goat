"use strict";

import React from "react";

export default React.createClass({
	render: function () {
		return (
			<nav className="navbar navbar-inverse navbar-fixed-bottom">
				<div className="container">
					<ul className="nav navbar-nav">
						<li><a href="/contact-us">Contact us</a></li>
						<li><a href="/terms-and-conditions">Terms and conditions</a></li>
					</ul>
					<p className="navbar-text navbar-right collapse navbar-collapse">
						&copy; CTAPbIu_MABP
					</p>
				</div>
			</nav>
		);
	}
});
