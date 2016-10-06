import React, {PropTypes, Component} from "react";
import Header from "./partials/header";
import Footer from "./partials/footer";


export default class GOAT extends Component {

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
				<Header {...this.props}/>
				{this.props.children}
				<Footer/>
			</div>
		);
	}
}
