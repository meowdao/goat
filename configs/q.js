"use strict";

import Q from "q";
import _ from "lodash";

// Q_DEBUG=1 node app.js

if (process.env.NODE_ENV === "development") {
	Q.longStackSupport = true;
}

Q.superAll = function (obj) {
	return Q.spread(_.values(obj), function () {
		return _.zipObject(_.keys(obj), arguments);
	});
};

export default Q;