import React, {PropTypes, Component} from "react";


export default class Empty extends Component {

	static displayName = "Components";

	static propTypes = {
		children: PropTypes.element.isRequired
	};

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}

}
