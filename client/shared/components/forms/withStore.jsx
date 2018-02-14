import React, {Component} from "react";
import {connect} from "react-redux";


export default function withStore(storeName, paramName = "_id") {
	return WrappedComponent => {
		// console.log("withStore:WrappedComponent", WrappedComponent);

		@connect(
			state => ({
				[storeName]: state[storeName]
			})
		)
		class ComponentToStore extends Component {
			componentWillMount() {
				// console.log("ComponentToStore:componentWillMount");
			}

			render() {
				// console.log("ComponentToStore:render", this.props);
				// return (<WrappedComponent />);
				return (<WrappedComponent
					{...this.props}
					storeName={storeName}
					paramName={paramName}
				/>);
			}
		}

		return ComponentToStore;

		/*
		return connect(
			state => ({
				[storeName]: state[storeName]
			})
		)(props => React.createElement(WrappedComponent, {storeName, ...props}));
		*/
	};
}
