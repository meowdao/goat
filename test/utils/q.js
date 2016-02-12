"use strict";

import q from "q";
import debug from "debug";
import assert from "power-assert";

const log = debug("test:q");

describe("q", () => {
	it("should throw error", () => {
		return q.resolve(true)
			.then(() => {
				throw new Error("ERROR");
			})
			.catch(error => {
				assert.ok(error);
			});
	});

	it("should throw error 2", () => {
		return q(true)
			.then(() => {
				throw new Error("ERROR");
			})
			.catch(error => {
				throw error;
			})
			.catch(error => {
				log(error);
				assert.ok(error);
			});
	});

	it("should throw error 3", () => {
		const deferred = q.defer();
		deferred.makeNodeResolver()(null, true);
		return deferred.promise
			.then(() => {
				throw new Error("ERROR");
			})
			.catch(error => {
				log(error);
				assert.ok(error);
			});
	});

	it("should use destructive assignment", () => {
		return q({
			a: 1,
			b: 2
		})
			.then(({a, b}) => {
				log("a", a);
				log("b", b);
			});
	});

	it("should rollback", () => {
		return q({})
			.then(o => {
				log("then 1", o);
				throw new Error("X");
			})
			.catch(e => {
				log("catch 1", e);
				return q({})
					.then(i => {
						log("then 2", i);
						throw e;
					});
			})
			.catch(e => {
				log("catch 2", e);
			});
	});
});
