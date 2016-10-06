import React, {PropTypes, Component} from "react";


export default class Title extends Component {

	static propTypes = {
		routes: PropTypes.array.isRequired
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	render() {
		const title = this.props.routes[this.props.routes.length - 1].component.displayName || "Default Title";

		return (
			<div className="page-header">
				<h1>{title}</h1>
			</div>
		);
	}
}
