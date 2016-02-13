"use strict";

import assert from "power-assert";


suite("simple suite", () => {
	test("simple test", () => {
		assert.ok(true);

		const actualObj = {
			array: [{value: 42}]
		};

		const expectedObject = {
			get value() {
				return null;
			}
		};

		assert.equal(actualObj.array[0].value, expectedObject.value);
	});
});
