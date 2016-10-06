import assert from "power-assert";
import {setStatus, setRegExp} from "../../server/utils/request";
import langServer from "../../server/lang/en/server";
import {tpl} from "../../server/utils/misc";


describe("Request", () => {
	describe("#setStatus", () => {
		class TestController {
			static displayName = "test2";
			static statuses = {
				active: "active"
			};
		}

		const error = tpl(langServer["param-is-invalid"], {name: "status"});

		it("setStatus status type is String ('')", () => {
			const query = {status: "all"};
			const clean = {};
			setStatus({query}, clean, TestController);
			assert.deepEqual(clean, {});
		});

		it("setStatus status type is String ('active')", () => {
			const query = {status: "active"};
			const clean = {};
			setStatus({query}, clean, TestController);
			assert.deepEqual(clean, {status: "active"});
		});

		it("setStatus status type is String ('fakestatus')", () => {
			const query = {status: "fakestatus"};
			const clean = {};
			assert.throws(() => {
				setStatus({query}, clean, TestController);
			}, e => e.message === error);
		});

		it("setStatus status type is Object ({})", () => {
			const query = {status: {}};
			const clean = {};
			setStatus({query}, clean, TestController);
			assert.deepEqual(clean, {status: "active"});
		});

		it("setStatus status type is Object ({active})", () => {
			const query = {status: {test: "active"}};
			const clean = {};
			setStatus({query}, clean, TestController);
			assert.deepEqual(clean, {status: "active"});
		});

		it("setStatus status type is Object ({fakestatus})", () => {
			const query = {status: {test: "fakestatus"}};
			const clean = {};
			assert.throws(() => {
				setStatus({query}, clean, TestController);
			}, e => e.message === error);
		});

		it("setStatus status type is Array ([])", () => {
			const query = {status: []};
			const clean = {};
			setStatus({query}, clean, TestController);
			assert.deepEqual(clean, {});
		});

		it("setStatus status type is Array ([active])", () => {
			const query = {status: ["active"]};
			const clean = {};
			setStatus({query}, clean, TestController);
			assert.deepEqual(clean, {status: {$in: ["active"]}});
		});

		it("setStatus status type is Array ([fakestatus])", () => {
			const query = {status: ["active", "fakestatus"]};
			const clean = {};
			assert.throws(() => {
				setStatus({query}, clean, TestController);
			}, e => e.message === error);
		});
	});

	describe("#setRegExp", () => {
		it("setRegExp with an array of queries", () => {
			const clean = {};
			const query = {
				boolean: true,
				number: 12345,
				string: "trejgun@gmail.com",
				array: [1, 2, 3],
				object: {x: 1},
				specialchars: "|\\[]{}()^$+*?.-",
				crap: "crap"
			};
			const fields = ["number", "string", "array", "object", "not-existing", "specialchars"];
			setRegExp({query}, clean, fields);
			assert.deepEqual(clean, {
				number: {$regex: "12345", $options: "i"},
				string: {$regex: "trejgun@gmail\\.com", $options: "i"},
				array: {$regex: "1,2,3", $options: "i"},
				object: {$regex: "\\[object Object\\]", $options: "i"},
				specialchars: {$regex: "\\|\\\\\\[\\]\\{\\}\\(\\)\\^\\$\\+\\*\\?\\.-", $options: "i"}
			});
		});

		it("setRegExp with empty query and fields", () => {
			const clean = {};
			const query = {};
			setRegExp({query}, clean, []);
			assert.deepEqual(clean, {});
		});
	});
});
