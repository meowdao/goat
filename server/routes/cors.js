export default function (app) {

	const headers = [
		"Accept",
		"Cache-Control",
		"Content-Type",
		"Idempotency-Key",
		"If-Modified-Since",
		"Origin",
		"Pragma"
	];

	app.use((request, response, next) => {
		response.set("Access-Control-Allow-Origin", request.get("Origin"));
		response.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.set("Access-Control-Allow-Credentials", true);
		response.set("Access-Control-Allow-Headers", headers.join(","));
		next();
	});
}
