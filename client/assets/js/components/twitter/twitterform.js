import React, {PropTypes} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Col, FormGroup, ControlLabel, FormControl, Button} from "react-bootstrap";
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
		query: "whats up?",
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

	getValidationState() {
		return this.state.q ? "success" : "error";
	}

	render() {
		return (
			<div className="container">
				<form onSubmit={::this.onSubmit}>
					<FormGroup
						controlId="formHorizontalEmail"
						validationState={this.getValidationState()}
					>
						<Col componentClass={ControlLabel} sm={4}>
							<FormControl
								autoFocus="true"
								type="text"
								placeholder="Search query"
								defaultValue={this.state.q}
								onChange={(e) => this.setState({q: e.target.value})}
							/>
						</Col>
					</FormGroup>
					<Col sm={2}>
						<FormControl
							componentClass="select"
							placeholder="Number of Twits"
							defaultValue="0"
							onChange={(e) => this.setState({count: ~~e.target.value})}
						>
							<option value="0">Number of Twits</option>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="30">30</option>
						</FormControl>
					</Col>
					<Col sm={2}>
						<Button
							bsStyle="info"
							type="submit"
						>
							Search
						</Button>
					</Col>
				</form>
			</div>

		);
	}

}
