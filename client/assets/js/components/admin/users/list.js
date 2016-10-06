import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import API from "../../../utils/API";
import {bindActionCreators} from "redux";
import {Col, FormGroup, FormControl, Button, ListGroup, ListGroupItem, Pagination} from "react-bootstrap";
import {Link} from "react-router";
import {LinkContainer} from "react-router-bootstrap";

// import {Link} from "react-router";
import {UPDATE_USER, UPDATE_USER_LIST} from "../../../constants/constants";


const userUpdate = data =>
	dispatch =>
		API.updateUsers(data)
			.then(response => {
				dispatch({
					type: UPDATE_USER,
					data: response
				});
			});

const getUsers = data =>
	dispatch =>
		API.searchUsers(data)
			.then(response => {
				dispatch({
					type: UPDATE_USER_LIST,
					data: response
				});
			});

@connect(
	state => ({
		users: state.users.usersData,
		count: state.users.count
	}),
	dispatch => bindActionCreators({userUpdate, getUsers}, dispatch)
)
export default class UserList extends Component {

	static displayName = "User List";

	static propTypes = {
		users: PropTypes.array,
		userUpdate: PropTypes.func,
		getUsers: PropTypes.func,
		count: PropTypes.number,
		skip: PropTypes.number,
		limit: PropTypes.number,
		email: PropTypes.string
	};

	static defaultProps = {
		users: [],
		skip: 0,
		limit: 5,
		count: 0,
		email: ""
	};

	state = {
		skip: this.props.skip,
		limit: this.props.limit,
		email: this.props.email
	};

	onSubmit(e) {
		e.preventDefault();
		this.setState({activePage: 1, skip: 0}, () => {
			this.props.getUsers(this.state);
		});
	}

	onChangeLimit(limit) {
		if (!this.validateEmailLength()) {
			this.setState({activePage: 1, skip: 0, limit}, () => {
				this.props.getUsers(this.state);
			});
		}
	}

	showList() {
		return (
			<ListGroup>
				{this.props.users.length === 0 ? "Nothing to display" : this.props.users.map(::this.renderListItem)}
			</ListGroup>

		);
	}

	changePages(e, selectedEvent) {
		this.setState({
			activePage: selectedEvent.eventKey,
			skip: selectedEvent.eventKey === 1 ? 0 : this.props.limit * selectedEvent.eventKey - this.props.limit
		}, () => {
			this.props.getUsers(this.state);
		});
	}

	showPagination() {
		if (this.state.activePage) {
			return (
				<Pagination
					prev
					next
					first
					last
					ellipsis
					items={this.state.limit ? Math.ceil(this.props.count / this.state.limit) : 1}
					maxButtons={5}
					activePage={this.state.activePage}
					onSelect={::this.changePages}
				/>
			);
		} else {
			return null;
		}
	}

	validateEmailLength() {
		const length = this.state.email.length;
		return length < 3;
	}

	showForm() {
		return (
			<form onSubmit={::this.onSubmit} className="form-horizontal">
				<FormGroup controlId="formHorizontalEmail">
					<Col sm={4}>
						<FormControl
							type="email"
							name="email"
							value={this.state.email}
							placeholder="me@example.com"
							onChange={e => this.setState({email: e.target.value})}
						/>
					</Col>

					<Col sm={2}>
						<FormControl
							componentClass="select"
							placeholder="select"
							onChange={(e) => this.onChangeLimit(~~e.target.value)}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</FormControl>
					</Col>

					<Col sm={1}>
						<Button
							type="submit"
							disabled={this.state.disabled}
						>
							Search
						</Button>
					</Col>
				</FormGroup>
			</form>
		);
	}

	renderListItem(user) {
		return (
			<ListGroupItem key={user._id}>
				<div className="row">
					<div className="col-sm-8">
						<h4 className="list-group-item-heading">
							<Link to={`/admin/user/edit/${user._id}`}>
								{`${user.fullName}`}
							</Link>
						</h4>
					</div>
				</div>
			</ListGroupItem>
		);
	}

	render() {
		return (
			<div className="container">
				{this.showForm()}
				{this.showList()}
			</div>
		);
	}
}
