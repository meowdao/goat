import React, {Component} from "react";
import PropTypes from "prop-types";
import Header from "./partials/header";
import Footer from "./partials/footer";


export default class Layout extends Component {
	static propTypes = {
		children: PropTypes.node
	};

	render() {
		return (
			<div>
				<Header />
				{this.props.children}
				<Footer />
			</div>
		);
	}
}
