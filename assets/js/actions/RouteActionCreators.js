"use strict";

import router from "../utils/router.js";

export default {

	transitionTo: function(to, params, query) {
		router.transitionTo(to, params, query);
	}

};
