import React, {Component} from "react";
import PropTypes from "prop-types";
import {IntlProvider} from "react-intl";
import {connect} from "react-redux";


@connect(
	state => ({
		intl: state.intl
	})
)
export default class IntlWrapper extends Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
		intl: PropTypes.object
	};

	render() {
		return (
			<IntlProvider {...this.props.intl} >
				{this.props.children}
			</IntlProvider>
		);
	}
}
