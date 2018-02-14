import React, {Component} from "react";
import PropTypes from "prop-types";
import {InputGroup} from "react-bootstrap";


export default function withAddons(FormControl) {
	return class InputAddons extends Component {
		static propTypes = {
			before: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
				PropTypes.element
			]),
			after: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
				PropTypes.element
			])
		};

		render() {
			const {before, after, ...props} = this.props;
			return (
				<InputGroup>
					{this.wrap(before)}
					<FormControl {...props} />
					{this.wrap(after)}
				</InputGroup>
			);
		}

		wrap(addon) {
			// ReactElement.isValidElement
			if (!addon) {
				return null;
			}
			return (
				<InputGroup.Addon>{addon}</InputGroup.Addon>
			);
		}
	};
}

