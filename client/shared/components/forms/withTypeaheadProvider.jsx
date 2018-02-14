import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import doAjaxAction from "../../actions/ajax";


export default function withTypeaheadProvider(storeName, action) {
	return WrappedComponent => {
		@connect(
			state => ({
				[action]: state[action]
			}),
			dispatch => bindActionCreators({doAjaxAction, dispatch: data => dispatch => dispatch(data)}, dispatch)
		)
		class TypeaheadProvider extends Component {
			static propTypes = {
				doAjaxAction: PropTypes.func,
				dispatch: PropTypes.func
			};

			componentDidMount() {
				// console.log("TypeaheadProvider:componentDidMount", this.props);
				if (!this.props[action].list.length) {
					this.props.doAjaxAction({
						action: `/${storeName}/${action}`,
						name: action,
						storeName
					});
				} else {
					this.props.dispatch({
						type: `${storeName}_${action}_success`,
						action,
						isLoading: false,
						success: true,
						data: this.props[action]
					});
				}
			}

			render() {
				// console.log("TypeaheadProvider:render", this.props);
				return (
					<WrappedComponent
						{...this.props}
					/>
				);
			}
		}

		return TypeaheadProvider;
	};
}
