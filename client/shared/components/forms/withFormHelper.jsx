import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import doAjaxAction from "../../actions/ajax";
import {messageShow} from "../../actions/message";
import withStore from "./withStore";


export default function withFormHelper(storeName, paramName) {
	return WrappedComponent => {
		// console.log("withFormHelper:WrappedComponent", WrappedComponent);

		@connect(
			() => ({}),
			dispatch => bindActionCreators({messageShow, doAjaxAction, dispatch: data => dispatch => dispatch(data)}, dispatch)
		)
		@withStore(storeName, paramName)
		class FormHelper extends Component {
			static propTypes = {
				storeName: PropTypes.string,
				doAjaxAction: PropTypes.func
			};

			state = {
				// don't remove
			};

			componentWillMount() {
				// console.log("FormHelper:componentWillMount");
			}

			componentDidMount() {
				// console.log("FormHelper:componentDidMount", this.props);
			}

			onChange(e) {
				// console.log("FormHelper:onChange", e, e.target, e.target.name, e.target.value, e.target.type, e.target.checked);
				// e.target.type returns select-one/select-multiple for <select>
				switch (e.target.getAttribute("type")) {
					case "number":
						return this.setState({[e.target.name]: e.target.value === "" ? e.target.value : parseFloat(e.target.value)});
					case "checkbox":
						return this.setState({[e.target.name]: e.target.checked});
					case "text":
					case "email":
					case "password":
					default:
						return this.setState({[e.target.name]: e.target.value});
				}
			}

			onSubmit(e) {
				console.log("withFormHelper:onSubmit", e);
				console.log("withFormHelper:onSubmit", ["action", "method", "name"].reduce((memo, name) => Object.assign(memo, {[name]: e.target.getAttribute(name)}), {}));
				e.preventDefault();
				return this.props.doAjaxAction({
					data: this.state,
					storeName: this.props.storeName,
					//  = {action: "/", method: "GET", name: "view"}
					...["action", "method", "name"].reduce((memo, name) => Object.assign(memo, {[name]: e.target.getAttribute(name)}), {})
				});
			}

			render() {
				// console.log("FormHelper:render", this.props, this.state);
				return (
					<WrappedComponent
						{...this.state}
						{...this.props}
						onChange={::this.onChange}
						setState={::this.setState}
						onSubmit={::this.onSubmit}
						forceUpdate={::this.forceUpdate}
					/>
				);
			}
		}

		return FormHelper;
	};
}
