"use strict";

import React from "react";
import Verification from "./email/verification.js";
import Empty from "./empty.js";


export default class EML extends React.Component {

	static propTypes = {
		//view: React.PropTypes.instanceOf(React.Component)
	};

	static defaultProps = {
		view: Empty
	};

	state = {
		view: this.props.view
	};

	constructor(props) {
		super(props);
		this.state = {
			view: this.props.view
		};
	}

	componentWillReceiveProps (props) {
		this.setState({
			view: props.view
		});
	}

	render() {
		return (
			<html>
			<head></head>
			<body>
			<this.state.view user={this.props.user}/>
			</body>
			</html>
		);
	}
}