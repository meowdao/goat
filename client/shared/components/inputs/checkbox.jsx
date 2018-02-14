import React, {Component} from "react";
import PropTypes from "prop-types";
import {Checkbox} from "react-bootstrap";


export default class MyCheckbox extends Component {
	static propTypes = {
		componentClass: PropTypes.string,
		type: PropTypes.string,
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
		children: PropTypes.node
	};

	static defaultProps = {
		// value: "",
		// defaultValue: "",
		onChange: Function
	};

	render() {
		// console.log("Input:render", this.props);
		// https://github.com/react-bootstrap/react-bootstrap/issues/2765
		return (
			<Checkbox
				id={this.props.name}
				{...this.props}
			>
				{this.props.children}
			</Checkbox>
		);
	}
}
