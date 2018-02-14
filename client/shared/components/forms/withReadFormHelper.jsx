import React, {Component} from "react";
import PropTypes from "prop-types";
import withFormHelper from "./withFormHelper";
import Loader from "../partials/loader";


export default function withReadFormHelper(storeName, paramName) {
	return WrappedComponent => {
		@withFormHelper(storeName, paramName)
		class ReadFormHelper extends Component {
			static propTypes = {
				setState: PropTypes.func,
				doAjaxAction: PropTypes.func,
				dispatch: PropTypes.func,
				paramName: PropTypes.string,
				storeName: PropTypes.string,

				match: PropTypes.shape({
					params: PropTypes.object.isRequired
				}).isRequired
			};

			state = {
				isNew: true,
				isReady: false
			};

			componentWillMount() {
				// console.log("ReadFormHelper:componentWillMount", this.props);
				const cached = this.getFromStore(this.props);
				if (cached) {
					this.props.setState(cached);
				}
			}

			componentDidMount() {
				// console.log("ReadFormHelper:componentDidMount", this.props);
				const cached = this.getFromStore(this.props);
				if (!cached) {
					this.props.doAjaxAction({
						action: `/${this.props.storeName}/${this.props.match.params[this.props.paramName]}`,
						storeName: this.props.storeName,
						name: "view"
					});
				} else {
					this.props.dispatch({
						type: `${storeName}_view_success`,
						name: "view",
						isLoading: false,
						success: true,
						data: cached
					});
				}
			}

			componentWillReceiveProps(nextProps) {
				// console.log("ReadFormHelper:componentWillReceiveProps", this.props);
				if (nextProps[storeName].isLoading && nextProps[storeName].name === "view") {
					this.setState({
						isNew: true,
						isReady: false
					});
				}

				if (!nextProps[storeName].isLoading && nextProps[storeName].success && nextProps[storeName].name === "view") {
					if (this.state.isNew) {
						this.setState({
							isNew: false
						}, () => {
							const cached = this.getFromStore(nextProps);
							if (cached) {
								this.props.setState(cached, () => {
									this.setState({
										isReady: true
									});
								});
							} else {
								this.setState({
									isReady: true
								});
							}
						});
					}
				}
			}

			getFromStore(props) {
				// console.log("ReadFormHelper:getFromStore", storeName, props);
				return props[storeName].list.find(item => item[paramName] === props.match.params[paramName]);
			}

			render() {
				// console.log("ReadFormHelper:render", this.props, this.state);
				if (this.state.isReady) {
					return (
						<WrappedComponent
							storeName={storeName}
							paramName={paramName}
							{...this.state}
							{...this.props}
						/>
					);
				} else {
					return (
						<Loader />
					);
				}
			}
		}

		return ReadFormHelper;
	};
}
