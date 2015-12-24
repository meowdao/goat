"use strict";

import moment from "moment"; // eslint-disable-line no-unused-vars
import DateRange from "moment-range"; // eslint-disable-line no-unused-vars
import tz from "moment-timezone"; // eslint-disable-line no-unused-vars


DateRange.prototype.contains = function(other, exclusive) {
	const start = this.start;
	const end = this.end;

	return other instanceof DateRange ?
	(start < other.start || (start.isSame(other.start) && !exclusive)) && (end > other.end || (end.isSame(other.end) && !exclusive)) :
	(start < other || (start.isSame(other) && !exclusive)) && (end > other || (end.isSame(other) && !exclusive));

};

export default moment;
