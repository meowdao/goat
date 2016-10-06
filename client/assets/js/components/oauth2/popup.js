import React, {PropTypes, Component} from "react";


export default class Popup extends Component {

	static displayName = "G.O.A.T.";

	static propTypes = {
		children: PropTypes.node,
		params: PropTypes.object.isRequired
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}
