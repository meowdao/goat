import q from "q";
import winston from "winston";
import assert from "power-assert";


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
				winston.debug(error);
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
				winston.debug(error);
				assert.ok(error);
			});
	});

	it("should use destructive assignment", () => {
		return q({
			a: 1,
			b: 2
		})
			.then(({a, b}) => {
				winston.debug("a", a);
				winston.debug("b", b);
			});
	});

	it("should rollback", () => {
		return q({})
			.then(o => {
				winston.debug("then 1", o);
				throw new Error("X");
			})
			.catch(e => {
				winston.debug("catch 1", e);
				return q({})
					.then(i => {
						winston.debug("then 2", i);
						throw e;
					});
			})
			.catch(e => {
				winston.debug("catch 2", e);
			});
	});
});
