"use strict";

import Q from "q";
import debug from "debug";
import assert from "assert";

let log = debug("test:q");

suite("Q", () => {

	test("should throw error", done => {

		Q()
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

		Q()
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

		let deferred = Q.defer();

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

		Q({
			a: 1,
			b: 2
		})
			.then(({a,b}) => {
				log("a", a);
				log("b", b);
			})
			.catch(assert.ifError)
			.finally(done)
			.done();

	});

	test("should rollback", done => {

		Q({})
			.then(o => {
				log("then 1", o);
				throw new Error("X");
			})
			.catch(e => {
				log("catch 1", e);
				return Q({})
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

