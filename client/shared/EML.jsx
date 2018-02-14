import React, {Component} from "react";
import PropTypes from "prop-types";


export default class EML extends Component {
	static propTypes = {
		initialMarkup: PropTypes.string
	};

	render() {
		return (
			<html>
				<head />
				<body>
					<div id="app" dangerouslySetInnerHTML={{__html: this.props.initialMarkup}} />
				</body>
			</html>
		);
	}
}
