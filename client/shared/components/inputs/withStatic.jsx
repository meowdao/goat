import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormControl} from "react-bootstrap";


export default function withStatic() {
	return class InputStatic extends Component {
		static propTypes = {
			value: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
				PropTypes.element
			])
		};

		render() {
			return (
				<FormControl.Static>
					{this.props.value}
				</FormControl.Static>
			);
		}
	};
}

