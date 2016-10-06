export default function (app) {
	app.use((error, request, response, next) => {
		void next; // eslint
		response.render("error", {error});
	});
}
