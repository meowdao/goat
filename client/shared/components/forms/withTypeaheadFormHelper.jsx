import React, {Component} from "react";
import withTypeaheadProvider from "./withTypeaheadProvider";
import withLoader from "./withLoader";


export default function withTypeaheadFormHelper(storeName, action) {
	return WrappedComponent => {
		@withTypeaheadProvider(storeName, action)
		@withLoader(action)
		class TypeaheadFormHelper extends Component {
			render() {
				// console.log("TypeaheadFormHelper:render", this.props);
				return (
					<WrappedComponent
						{...this.props}
						storeName={action}
					/>
				);
			}
		}

		return TypeaheadFormHelper;
	};
}
