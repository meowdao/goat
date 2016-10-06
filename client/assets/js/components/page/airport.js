/* global google:true */

import React, {PropTypes, Component} from "react";
import {Tabs, Tab, Input, ButtonInput, Navbar} from "react-bootstrap";
import {GoogleMapLoader, GoogleMap, DirectionsRenderer} from "react-google-maps";


export default class Airport extends Component {

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
		key: this.props.key,
		mapLoaded: false,
		origin: "Kiev, Ukraine",
		destination: "Lviv, Ukraine",
		directions: null,
		travelMode: "DRIVING"
	};

	componentWillMount() {
		this.setState({
			key: this.props.params.key
		});
	}

	componentDidMount() {
		this.loadScript("http://maps.googleapis.com/maps/api/js?language=ru", () => {
			this.setState({
				mapLoaded: true
			});
			this.getDirections();
		});
	}

	onSelect(key) {
		this.setState({key});
		const map = ["", "schedule", "flight", "ticket", "map"];
		this.context.router.push("/airport/" + map[key - 1]);
	}

	onSubmit(e) {
		e.preventDefault();
		this.getDirections();
	}

	onFlip(e) {
		e.preventDefault();
		this.setState({
			destination: this.state.origin,
			origin: this.state.destination
		});
	}

	getDirections() {
		const DirectionsService = new google.maps.DirectionsService();
		DirectionsService.route({
			origin: this.state.origin,
			destination: this.state.destination,
			travelMode: this.state.travelMode,
			transitOptions: {
				modes: [
					google.maps.TransitMode.BUS,
					google.maps.TransitMode.RAIL,
					google.maps.TransitMode.SUBWAY,
					google.maps.TransitMode.TRAIN,
					google.maps.TransitMode.TRAM
				],
				routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
			}
		}, (result, status) => {
			if (status === google.maps.DirectionsStatus.OK) {
				this.setState({
					directions: result
				});
			} else {
				console.error(`error fetching directions ${result}`);
			}
		});
	}

	loadScript(url, callback) {
		const head = document.getElementsByTagName("head")[0];
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.onreadystatechange = callback;
		script.onload = callback;
		head.appendChild(script);
	}

	renderDirections() {
		if (this.state.directions) {
			return (
				<DirectionsRenderer directions={this.state.directions} panel={this.refs.rp}/>
			);
		}
		return null;
	}

	renderMap() {
		return (
			<GoogleMap
				ref="map"
				defaultZoom={3}
				defaultCenter={{lat: -25.363882, lng: 131.044922}}
			>
				{this.renderDirections()}
			</GoogleMap>
		);
	}

	renderLoader() {
		return (
			<div {...this.props} id="map"></div>
		);
	}

	renderMapLoader() {
		if (this.state.mapLoaded) {
			return (
				<GoogleMapLoader
					containerElement={this.renderLoader()}
					googleMapElement={this.renderMap()}
				/>
			);
		}
		return null;
	}

	render() {
		return (
			<Tabs activeKey={this.state.key} onSelect={::this.onSelect}>
				<Tab eventKey={1} title="Информация">Tab 1 content</Tab>
				<Tab eventKey={2} title="Табло аэропорта">Tab 2 content</Tab>
				<Tab eventKey={3} title="Рейсы">Tab 3 content</Tab>
				<Tab eventKey={4} title="Дешевые авиабилеты">Tab 4 content</Tab>
				<Tab eventKey={5} title="Как добраться">
					<Navbar.Form className="center-block text-center">
						<Input
							type="text"
							placeholder="Origin"
							value={this.state.origin}
							onChange={e => this.setState({origin: e.target.value})}
						/>
						{" "}
						<ButtonInput value="⇆" onClick={::this.onFlip}/>
						{" "}
						<Input
							type="text"
							placeholder="Destination"
							value={this.state.destination}
							onChange={e => this.setState({destination: e.target.value})}
						/>
						{" "}
						<Input
							type="select"
							placeholder="select"
							className="col-xs-2"
							onChange={e => this.setState({travelMode: e.target.value})}
						>
							<option value="DRIVING">На автомобиле</option>
							<option value="WALKING">Пешком</option>
							<option value="BICYCLING">На велосипедe</option>
							<option value="TRANSIT">На общественном транспорте</option>
						</Input>
						{" "}
						<ButtonInput value="Get directions" onClick={::this.onSubmit}/>
					</Navbar.Form>
					{this.renderMapLoader()}
					<div id="right-panel" ref="rp"></div>
				</Tab>
			</Tabs>
		);
	}
}
