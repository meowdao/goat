import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormControl} from "react-bootstrap";


export default class Input extends Component {
	static propTypes = {
		componentClass: PropTypes.string,
		type: PropTypes.string,
		placeholder: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.bool
		]),
		defaultValue: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.bool
		]),
		name: PropTypes.string,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		children: PropTypes.node,
		autoComplete: PropTypes.string
	};

	static defaultProps = {
		// value: "",
		// defaultValue: "",
		componentClass: "input",
		type: "text",
		disabled: false,
		autoComplete: null,
		onChange: Function
	};

	render() {
		// console.log("Input:render", this.props.onChange);
		return (
			<FormControl
				{...this.props}
			>
				{this.props.children}
			</FormControl>
		);
	}
}
