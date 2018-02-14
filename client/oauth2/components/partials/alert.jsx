import React, {Component} from "react";
import PropTypes from "prop-types";
import {Alert, Grid} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";
import {readFromQueryString} from "../../../shared/utils/location";


@withRouter
export default class AlertContainer extends Component {
	static propTypes = {
		location: PropTypes.shape({
			search: PropTypes.string.isRequired
		}).isRequired
	};

	state = {
		alert: ""
	};

	componentWillMount() {
		this.setState({
			alert: readFromQueryString("alert", this.props.location.search)
		});
	}

	render() {
		// console.log("AlertContainer:render", this.props, this.state);
		if (this.state.alert) {
			return (
				<Grid>
					<Alert bsStyle="danger">
						<FormattedMessage id={`alert.${this.state.alert}`} />
					</Alert>
				</Grid>
			);
		} else {
			return (
				<div style={{height: 74}} />
			);
		}
	}
}

