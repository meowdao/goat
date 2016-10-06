import assert from "power-assert";
import {
	getRandomElementFromArray,
	getRandomInt,
	getRandomString,
	formatUrl,
	isType,
	toDollars,
	toTitleCase,
	tpl
} from "../../server/utils/misc";


describe("Misc", () => {
	describe("#getRandomElementFromArray", () => {
		it("should get random element", () => {
			const array = [0, 1, 2, 3, 4];
			assert.ok(array.includes(getRandomElementFromArray(array)));
		});
	});

	describe("#getRandomString", () => {
		const patterns = [/[0-9]/, /[A-Z]/, /[A-Z0-9]/, /[A-Z0-9]/i];
		patterns.forEach((pattern, i) => {
			it(`random string for a type ${i}`, () => {
				const length = Math.ceil((Math.random() * 100));
				const str = getRandomString(length, i);
				assert.equal(patterns[i].test(str), true);
				assert.equal(str.length, length);
			});
		});

		it("random string for default settings", () => {
			const pattern = /[A-Z0-9]/i;
			const str = getRandomString();
			assert.equal(pattern.test(str), true);
			assert.equal(str.length, 64);
		});
	});

	describe("#getRandomInt", () => {
		const patterns1 = [[-20, -10], [-10, 10], [0, 0], [10, -10], [10, 20]];
		patterns1.forEach(pattern => {
			it(`random return int (${pattern[0]}, ${pattern[1]})`, () => {
				const int = getRandomInt(pattern[0], pattern[1]);
				assert.ok(int >= Math.min(pattern[0], pattern[1]));
				assert.ok(int <= Math.max(pattern[0], pattern[1]));
				assert.equal(int % 1, 0);
			});
		});

		const patterns2 = [[-Infinity, Infinity], [Number.NaN, 0], [Number.NaN, Infinity]];
		patterns2.forEach(pattern => {
			it(`should return NaN (${pattern[0]}, ${pattern[1]})`, () => {
				const int = getRandomInt(pattern[0], pattern[1]);
				assert.ok(Number.isNaN(int));
			});
		});

		// [[Math.E, Math.PI]] -> Math.E
	});

	describe("#toDollars", () => {
		it("should format number", () => {
			assert.equal(toDollars(Math.PI * 100), "$3.14");
		});

		it("should format 0", () => {
			assert.equal(toDollars(), "$0.00");
		});
	});

	describe("#toTitleCase", () => {
		it("should convert file name", () => {
			assert.equal(toTitleCase("controller.js"), "Controller");
		});

		it("should convert file name with dash", () => {
			assert.equal(toTitleCase("abstract-controller.js"), "AbstractController");
		});
	});

	describe("#formatUrl", () => {
		it("should format url", () => {
			assert.equal(formatUrl({protocol: "https", hostname: "localhost", port: "443"}), "https://localhost:443");
		});

		it("should omit port 80", () => {
			assert.equal(formatUrl({protocol: "http", hostname: "localhost", port: "80"}), "http://localhost");
		});
	});

	describe("#isType", () => {
		const variables = [new Object(), new Array(), void 0, null, new Date(), "string", 1, new Error(), new RegExp()]; // eslint-disable-line no-new-object, no-array-constructor
		const types = ["Object", "Array", "Undefined", "Null", "Date", "String", "Number", "Error", "RegExp"];
		variables.forEach((variable, i) => {
			it(`check a type of ${variable}`, () => {
				const result = isType(variable, types[i]);
				assert.equal(result, true);
			});
		});
	});

	describe("#tpl", () => {
		it("should format string using flat object", () => {
			assert.equal(tpl("Hello ${world}!", {world: "World"}), "Hello World!");
		});

		it("should format string using nested object", () => {
			assert.equal(tpl("Hello ${obj.prop}!", {obj: {prop: "World"}}), "Hello World!");
		});
	});
});
