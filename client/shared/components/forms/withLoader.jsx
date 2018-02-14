import React, {Component} from "react";
import Loader from "../partials/loader";


export default function withLoader(storeName) {
	return WrappedComponent => {
		class AsyncComponentHelper extends Component {
			render() {
				// console.log("AsyncComponentHelper:render", this.props);
				if (this.props[storeName].isLoading) {
					return (
						<Loader />
					);
				} else {
					if (this.props[storeName].success === null) {
						return null;
					} else {
						return (
							<WrappedComponent {...this.props} />
						);
					}
				}
			}
		}

		return AsyncComponentHelper;
	};
}
