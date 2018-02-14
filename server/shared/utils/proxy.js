import configs from "../../shared/configs/config";


export default function(app) {
	const config = configs[process.env.NODE_ENV];

	if (config.session.proxy) {
		app.enable("trust proxy");
	}
}
