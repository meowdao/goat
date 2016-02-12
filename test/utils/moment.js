"use strict";

import assert from "power-assert";
import moment from "moment";
import {date} from "../../server/utils/constants/date.js";

const startDate = moment(date).startOf("hour").toDate();
const endDate = moment(date).endOf("hour").toDate();

describe("moment", () => {
	describe("min => max", () => {
		it("range min => max", () => {
			assert.equal(moment.range(startDate, endDate).contains(new Date()), true);
		});

		it("range max => min", () => {
			assert.equal(moment.range(endDate, startDate).contains(new Date()), false);
		});
	});

	describe("borders", () => {
		it("range borders inclusive", () => {
			assert.equal(moment.range(startDate, endDate).contains(startDate), true);
			assert.equal(moment.range(startDate, endDate).contains(endDate), true);
		});

		it("range borders exclusive", () => {
			assert.equal(moment.range(startDate, endDate).contains(startDate, true), false);
			assert.equal(moment.range(startDate, endDate).contains(endDate, true), false);
		});
	});
});
