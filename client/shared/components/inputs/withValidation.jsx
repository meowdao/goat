import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import removeValidation from "../../actions/validation";


export default function withValidation(Input) {
	class InputWithValidation extends Component {
		static propTypes = {
			validations: PropTypes.array,
			onChange: PropTypes.func,
			removeValidation: PropTypes.func,
			name: PropTypes.string
		};

		static defaultProps = {
			validations: []
		};

		componentWillUnmount() {
			const validation = this.getValidation(this.props.name);
			if (validation) {
				this.props.removeValidation(validation);
			}
		}

		onChange(e) {
			const validation = this.getValidation(this.props.name);
			if (validation) {
				this.props.removeValidation(validation);
			}
			this.props.onChange(e);
		}

		getValidation(name) {
			return this.props.validations.find(validation => validation.name === name);
		}

		render() {
			// console.log("InputWithValidation:render", this.props);
			const {validations, removeValidation, ...props} = this.props;
			return (
				<Input {...props} onChange={::this.onChange} validation={this.getValidation(this.props.name)} />
			);
		}
	}

	return connect(
		state => ({
			validations: state.validations
		}),
		dispatch => bindActionCreators({removeValidation}, dispatch)
	)(InputWithValidation);
}
