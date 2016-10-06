import React, {PropTypes, Component} from "react";


export default class EML extends Component {

	static propTypes = {
		children: PropTypes.node
	};

	render() {
		return (
			<html>
			<head></head>
			<body>
			{this.props.children}
			</body>
			</html>
		);
	}
}
