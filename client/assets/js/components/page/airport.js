"use strict";

import React, {PropTypes, Component} from "react";
import {Tabs, Tab} from "react-bootstrap";


export default class AirportIndex extends Component {

	static displayName = "Airport";

	static propTypes = {
		key: PropTypes.number,
		params: PropTypes.object.isRequired
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static defaultProps = {
		key: 1
	};

	state = {
		key: this.props.key
	};

	componentWillMount() {
		this.setState({
			key: this.props.params.key
		});
	}

	onSelect(key) {
		this.setState({key});
		const map = ["", "schedule", "flight", "ticket", "map"];
		this.context.router.push("/airport/" + map[key - 1]);
	}

	render() {
		return (
			<Tabs activeKey={this.state.key} onSelect={::this.onSelect}>
				<Tab eventKey={1} title="Информация">Tab 1 content</Tab>
				<Tab eventKey={2} title="Табло аэропорта">Tab 2 content</Tab>
				<Tab eventKey={3} title="Рейсы">Tab 3 content</Tab>
				<Tab eventKey={4} title="Дешевые авиабилеты">Tab 4 content</Tab>
				<Tab eventKey={5} title="Как добраться">Tab 5 content</Tab>
			</Tabs>
		);
	}
}
