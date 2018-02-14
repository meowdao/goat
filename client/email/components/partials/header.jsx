import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";



@connect(
	state => ({
		user: state.user
	})
)
export default class Header extends Component {
	static propTypes = {
		user: PropTypes.object
	};

	render() {
		return (
			<div>

			</div>
		);
	}
}
