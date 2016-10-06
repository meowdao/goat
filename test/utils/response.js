import assert from "power-assert";
import {addPaginationHeaders} from "../../server/utils/response";

describe("Response", () => {
	describe("#addPaginationHeaders", () => {
		function setRequest(arg) {
			return Object.assign({
				route: {
					path: "/pages"
				},
				query: {
					pageSize: 5,
					page: 3
				}
			}, arg);
		}

		const response = {
			headers: {},
			set(header, url) {
				this.headers[header] = url;
			}
		};

		let protocol;
		let hostname;
		let port;

		before(() => {
			protocol = process.env.ABL_SERVER_PROTOCOL;
			hostname = process.env.ABL_SERVER_HOSTNAME;
			port = process.env.ABL_SERVER_PORT;
		});

		after(() => {
			process.env.ABL_SERVER_PROTOCOL = protocol;
			process.env.ABL_SERVER_HOSTNAME = hostname;
			process.env.ABL_SERVER_PORT = port;
		});

		describe("#http", () => {
			before(() => {
				process.env.ABL_SERVER_PROTOCOL = "http";
				process.env.ABL_SERVER_HOSTNAME = "localhost";
				process.env.ABL_SERVER_PORT = "80";
			});

			it("addPaginationHeaders page !== 0, page !== last", () => {
				response.headers = {};
				addPaginationHeaders(setRequest(), response, 30);
				assert.equal(response.headers["X-First-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=0");
				assert.equal(response.headers["X-Prev-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=2");
				assert.equal(response.headers["X-Next-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=4");
				assert.equal(response.headers["X-Last-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=6");
			});

			it("addPaginationHeaders page = 0, page !== last", () => {
				response.headers = {};
				addPaginationHeaders(setRequest({query: {pageSize: 5, page: 0}}), response, 30);
				assert.equal(response.headers["X-First-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=0");
				assert.equal(response.headers["X-Prev-Page-Url"], void 0);
				assert.equal(response.headers["X-Next-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=1");
				assert.equal(response.headers["X-Last-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=6");
			});

			it("addPaginationHeaders page !== 0, page = last", () => {
				response.headers = {};
				addPaginationHeaders(setRequest({query: {pageSize: 5, page: 6}}), response, 30);
				assert.equal(response.headers["X-First-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=0");
				assert.equal(response.headers["X-Prev-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=5");
				assert.equal(response.headers["X-Next-Page-Url"], void 0);
				assert.equal(response.headers["X-Last-Page-Url"], "http://localhost:8080/pages?pageSize=5&page=6");
			});
		});

		describe.skip("#https", () => {
			before(() => {
				process.env.ABL_SERVER_PROTOCOL = "https";
				process.env.ABL_SERVER_HOSTNAME = "localhost";
				process.env.ABL_SERVER_PORT = "443";
			});

			it("addPaginationHeaders page !== 0, page !== last", () => {
				response.headers = {};
				addPaginationHeaders(setRequest(), response, 30);
				assert.equal(response.headers["X-First-Page-Url"], "https://localhost:443/pages?pageSize=5&page=0");
				assert.equal(response.headers["X-Prev-Page-Url"], "https://localhost:443/pages?pageSize=5&page=2");
				assert.equal(response.headers["X-Next-Page-Url"], "https://localhost:443/pages?pageSize=5&page=4");
				assert.equal(response.headers["X-Last-Page-Url"], "https://localhost:443/pages?pageSize=5&page=6");
			});

			it("addPaginationHeaders page = 0, page !== last", () => {
				response.headers = {};
				addPaginationHeaders(setRequest({query: {pageSize: 5, page: 0}}), response, 30);
				assert.equal(response.headers["X-First-Page-Url"], "https://localhost:443/pages?pageSize=5&page=0");
				assert.equal(response.headers["X-Prev-Page-Url"], void 0);
				assert.equal(response.headers["X-Next-Page-Url"], "https://localhost:443/pages?pageSize=5&page=1");
				assert.equal(response.headers["X-Last-Page-Url"], "https://localhost:443/pages?pageSize=5&page=6");
			});

			it("addPaginationHeaders page !== 0, page = last", () => {
				response.headers = {};
				addPaginationHeaders(setRequest({query: {pageSize: 5, page: 6}}), response, 30);
				assert.equal(response.headers["X-First-Page-Url"], "https://localhost:443/pages?pageSize=5&page=0");
				assert.equal(response.headers["X-Prev-Page-Url"], "https://localhost:443/pages?pageSize=5&page=5");
				assert.equal(response.headers["X-Next-Page-Url"], void 0);
				assert.equal(response.headers["X-Last-Page-Url"], "https://localhost:443/pages?pageSize=5&page=6");
			});
		});
	});
});
