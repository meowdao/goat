import winston from "winston";
import supertest from "../../test-utils/supertest";
import assert from "power-assert";
import {setUp, tearDown} from "../../test-utils/flow";


let data;

describe("Category", () => {
	const superapp = supertest("blog");

	describe("GET /categories", () => {
		before(() =>
			setUp([{
				model: "User",
				count: 1
			}])
				.then(result => {
					data = result;
				})
		);

		it("should edit affiliate", () =>
			superapp
				.login(data.User[0])
				.get("/api/categories")
				.expect(200)
				.then(({body}) => {
					winston.debug("body", body);
					assert.equal(body.list.length, 21);
				})
		);

		after(tearDown);
	});

});
