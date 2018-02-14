import winston from "winston";
import assert from "power-assert";


const dict = {
	400: "invalid-param",
	403: "access-denied",
	404: "not-found",
	409: "conflict",
	410: "not-active"
};

export default function expect(code, expected) {
	return ({body}) => {
		winston.info("body", body);
		assert.equal(body.status, code);
		assert.equal(body.errors.length, expected.length);
		expected.forEach(({reason, name}, i) => {
			assert.equal(body.errors[i].message, dict[code]);
			assert.equal(body.errors[i].reason, reason, "reason");
			assert.equal(body.errors[i].name, name, "name");
		});
	};
}
