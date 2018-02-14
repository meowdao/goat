import React, {Component} from "react";


export default function withListFormHelper() {
	return WrappedComponent => {
		// @withFormHelper(storeName)
		// @withStore(storeName)
		class ListFormHelper extends Component {
			render() {
				// console.log("ListFormHelper:render", this.props);
				return (
					<WrappedComponent
						{...this.props}
					/>
				);
			}
		}

		return ListFormHelper;
	};
}
