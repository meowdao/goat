"use strict";

import React from "react"; // eslint-disable-line no-unused-vars
import {Router} from "react-router";
import DevTools from "../utils/devtools.js";

export default class extends Router {

	render() {
		if (process.env.NODE_ENV !== "production") {
			return (
				<div>
					<Router {...this.props}/>
					<DevTools/>
				</div>
			);
		} else {
			return (<Router {...this.props}/>);
		}
	}

}
