"use strict";

import assert from "power-assert";
import {setRegExp} from "../../server/utils/utils";

describe("setRegExp - Return a new object with transformed RegExp special characters", () => {

	it("Takes an array of queries and returns edited object", () => {
		const clean = {};
		const query = {email: "trejgun@gmail.com", fakedata: "L(&*^%$#%hvutcy//\fty56ctz53@$!@#$%^&*", crap: "crap"};
		const fields = ["email", "fakedata"];
		setRegExp(clean, query, fields);

		assert.deepEqual(clean, {
			email: {$regex: "^trejgun@gmail\\.com$", $options: "i"},
			fakedata: {$regex: "^L\\(&\\*\\^%\\$#%hvutcy//\fty56ctz53@\\$!@#\\$%\\^&\\*$", $options: "i"}
		});
	});

	it("takes empty query and fields", () => {
		const clean = {};
		setRegExp(clean, {}, []);
		assert.deepEqual(clean, {});
	});
});


