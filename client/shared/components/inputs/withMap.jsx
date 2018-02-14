import React, {Component} from "react";
import PropTypes from "prop-types";
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import withScriptjs from "react-google-maps/lib/withScriptjs";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {messageShow} from "../../actions/message";


const Map = withScriptjs(withGoogleMap(
	class MyMap extends Component {
		static propTypes = {
			onMapMounted: PropTypes.func,
			onBoundsChanged: PropTypes.func,
			onPlacesChanged: PropTypes.func,
			center: PropTypes.object
		};

		componentDidMount() {
			const searchBox = new google.maps.places.SearchBox(document.querySelector("[name=\"address\"]"));
			searchBox.addListener("places_changed", () => {
				this.props.onPlacesChanged(searchBox.getPlaces());
			});
		}

		render() {
			return (
				<GoogleMap
					ref={this.props.onMapMounted}
					defaultZoom={12}
					center={this.props.center}
					onBoundsChanged={this.props.onBoundsChanged}
				>
					<Marker position={this.props.center} />
				</GoogleMap>
			);
		}
	}
));

function round(num) {
	return parseFloat(num.toFixed(5));
}

// https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
const geolocation = (
	typeof window !== "undefined" && window.navigator && window.navigator.geolocation ?
		navigator.geolocation :
		({
			getCurrentPosition(success, failure) {
				failure(new Error("Your browser doesn't support geolocation."));
			}
		})
);


export default function withMap(Input) {
	class InputMap extends Component {
		static propTypes = {
			onChange: PropTypes.func,
			name: PropTypes.string,
			defaultValue: PropTypes.string,
			coordinates: PropTypes.arrayOf(PropTypes.number),
			messageShow: PropTypes.func
		};

		state = {
			address: this.props.defaultValue,
			coordinates: {
				lat: this.props.coordinates[1],
				lng: this.props.coordinates[0]
			}
		};

		componentDidMount() {
			// console.log("InputMap:componentDidMount")
			geolocation.getCurrentPosition(position => {
				this.setState({
					lat: round(position.coords.latitude),
					lng: round(position.coords.longitude)
				}, this.onSetState);
			}, error => {
				console.error(error);
				// TODO this massage shows twice if geolocation is disabled
				this.props.messageShow({
					type: "danger",
					message: `The Geolocation service failed (${error.message}).`
				});
			});
		}

		onSetState() {
			this.props.onChange({
				address: this.state.address,
				coordinates: [this.state.coordinates.lng, this.state.coordinates.lat]
			});
		}

		onPlacesChanged(places) {
			if (places.length) {
				this.setState({
					address: places[0].formatted_address,
					// address: places[0].address_components.map(component => component.long_name),
					coordinates: {
						lat: round(places[0].geometry.location.lat()),
						lng: round(places[0].geometry.location.lng())
					}
				}, this.onSetState);
			}
		}

		onMapMounted(map) {
			this._map = map;
		}

		onBoundsChanged() {
			const latLng = this._map.getCenter();

			clearTimeout(this._timeout);
			this._timeout = setTimeout(() => {
				if (latLng.lat() === 0 && latLng.lng() === 0) {
					return;
				}
				const geocoder = new google.maps.Geocoder;
				geocoder.geocode({location: latLng}, (results, status) => {
					if (status === "OK") {
						if (results[0]) {
							this.setState({
								address: results[0].formatted_address
							}, this.onSetState);
						} else {
							this.props.messageShow({
								type: "danger",
								message: "No results found"
							});
						}
					} else {
						this.props.messageShow({
							type: "danger",
							message: `Geocoder failed due to: ${status}`
						});
					}
				});
			}, 500);

			this.setState({
				coordinates: {
					lat: round(latLng.lat()),
					lng: round(latLng.lng())
				}
			}, this.onSetState);
		}

		onChange(e) {
			this.setState({
				address: e.target.value
			}, this.onSetState);
		}

		render() {
			return (
				<div>
					<Input name={this.props.name} defaultValue={this.state.address} onChange={::this.onChange} />
					<Map
						googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDE04gHh_7770gDIvqX-euawlW7IWEtKYI&libraries=places"
						loadingElement={
							<div style={{height: "100%", width: "100%"}} />
						}
						containerElement={
							<div style={{height: "400px", width: "100%"}} />
						}
						mapElement={
							<div style={{height: "400px", width: "100%"}} />
						}

						center={this.state.coordinates}

						onMapMounted={::this.onMapMounted}
						onBoundsChanged={::this.onBoundsChanged}
						onPlacesChanged={::this.onPlacesChanged}
					/>
				</div>
			);
		}
	}

	return connect(
		() => ({}),
		dispatch => bindActionCreators({messageShow}, dispatch)
	)(InputMap);
}
