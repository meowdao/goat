"use strict";

import assert from "assert";
import moment from "moment";
import {date} from "../../server/utils/constants/date.js";

const startDate = moment(date).startOf("hour").toDate();
const endDate = moment(date).endOf("hour").toDate();

suite("moment", () => {

	suite("min => max", () => {

		test("range min => max", () => {

			assert.equal(moment.range(startDate, endDate).contains(new Date()), true);

		});

		test("range max => min", () => {

			assert.equal(moment.range(endDate, startDate).contains(new Date()), false);

		});
	});

	suite("borders", () => {

		test("range borders inclusive", () => {

			assert.equal(moment.range(startDate, endDate).contains(startDate), true);
			assert.equal(moment.range(startDate, endDate).contains(endDate), true);

		});

		test("range borders exclusive", () => {

			assert.equal(moment.range(startDate, endDate).contains(startDate, true), false);
			assert.equal(moment.range(startDate, endDate).contains(endDate, true), false);

		});
	});

});
