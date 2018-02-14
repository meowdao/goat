import "./oauth2/styles.less";
import "../static/favicon.ico";
import App from "./oauth2/app";
import hydrate from "./shared/utils/hydrate";
import configureStore from "./oauth2/store";


process.env.MODULE = "oauth2";

const store = configureStore(window.__INITIAL_STATE__);

hydrate(App, store);

if (module.hot) {
	module.hot.accept("./oauth2/app", () => {
		hydrate(App, store);
	});
}
