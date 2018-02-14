import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {enabledLanguages} from "../../../../shared/constants/language";
import InputGroupValidation from "../../../shared/components/inputs/input.group.validation";


export default class UserUpdateForm extends Component {
	static propTypes = {
		defaultValue: PropTypes.string,
		onChange: PropTypes.func
	};

	render() {
		return (
			<InputGroupValidation
				name="language"
				componentClass="select"
				defaultValue={this.props.defaultValue}
				onChange={this.props.onChange}
			>
				{enabledLanguages.map(language =>
					(<FormattedMessage key={language} id={`components.language.${language}`}>
						{formattedMessage => <option key={language} value={language}>{formattedMessage}</option>}
					</FormattedMessage>)
				)}
			</InputGroupValidation>
		);
	}
}
