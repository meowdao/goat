"use strict";

import React, {PropTypes} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, ButtonInput} from "react-bootstrap";
import API from "../../utils/API";
import {UPDATE_TWITTER_LIST} from "../../constants/constants";

const twits = data =>
	dispatch =>
		API.searchTwits(data)
			.then(response => {
				dispatch({
					type: UPDATE_TWITTER_LIST,
					data: response.statuses
				});
			});


@connect(
	() => ({}),
	dispatch => bindActionCreators({twits}, dispatch)
)

export default class TwitterForm extends React.Component {

	static propTypes = {
		query: PropTypes.string,
		count: PropTypes.number,
		twits: PropTypes.func

	};

	static defaultProps = {
		query: "",
		count: 0
	};

	state = {
		q: this.props.query,
		count: this.props.count
	};

	onSubmit(e) {
		e.preventDefault();
		this.props.twits(this.state);
	}

	render() {
		return (
			<div className="container">
				<form onSubmit={::this.onSubmit}>
					<div className="row">
						<div className="col-sm-4">
							<Input
								autoFocus="true"
								type="text"
								placeholder="Search query"
								defaultValue={this.state.q}
								onChange={(e) => this.setState({q: e.target.value})}
							/>
						</div>
						<div className="col-sm-2">
							<Input
								type="select"
								defaultValue="0"
								onChange={(e) => this.setState({count: ~~e.target.value})}
							>
								<option value="0">Number of Twits</option>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="30">30</option>
							</Input>
						</div>
						<ButtonInput
							type="submit"
							value="Search"
							bsStyle="info"
						/>
					</div>
				</form>
			</div>

		);
	}

}
