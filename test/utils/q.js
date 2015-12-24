"use strict";

import q from "q";
import debug from "debug";
import assert from "assert";

const log = debug("test:q");

suite("Q", () => {

	test("should throw error", done => {

		q()
			.then(() => {
				throw new Error("ERROR");
			})
			.catch(error => {
				assert.ok(error);
			})
			.finally(done)
			.done();

	});

	test("should throw error 2", done => {

		q()
			.then(() => {
				throw new Error("ERROR");
			})
			.catch(error => {
				throw error;
			})
			.catch(error => {
				log(error);
				assert.ok(error);
			})
			.finally(done)
			.done();

	});

	test("should throw error 3", done => {

		const deferred = q.defer();

		deferred.makeNodeResolver()(null, true);

		deferred.promise
			.then(() => {
				throw new Error("ERROR");
			})
			.catch(error => {
				log(error);
				assert.ok(error);
			})
			.finally(done)
			.done();

	});

	test("should use destructive assignment", done => {

		q({
			a: 1,
			b: 2
		})
			.then(({a, b}) => {
				log("a", a);
				log("b", b);
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

	});

	test("should rollback", done => {

		q({})
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
			})
			.finally(done)
			.done();

	});

});
