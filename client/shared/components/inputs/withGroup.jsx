import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormGroup, ControlLabel, Col, Glyphicon, HelpBlock} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {viewItemLabel, viewItemValue} from "../../../../shared/constants/display";


export default function withGroup(Input) {
	return class InputWithGroup extends Component {
		static propTypes = {
			name: PropTypes.string,
			required: PropTypes.bool,
			validation: PropTypes.shape({
				name: PropTypes.string,
				reason: PropTypes.string
			}),
			children: PropTypes.node
		};

		render() {
			// console.log("InputWithGroup:render", this.props);
			const {required, validation, ...props} = this.props;
			return (
				<FormGroup controlId={this.props.name} validationState={validation ? "error" : null}>
					<Col componentClass={ControlLabel} xs={viewItemLabel}>
						<FormattedMessage id={`forms.${this.props.name}`} />
						{required ? <sup><Glyphicon glyph="asterisk" /></sup> : null}
					</Col>
					<Col xs={viewItemValue}>
						<Input {...props} />
						{validation ? <HelpBlock><FormattedMessage id={`models.${validation.name}.${validation.reason}`} /></HelpBlock> : null}
					</Col>
				</FormGroup>
			);
		}
	};
}
