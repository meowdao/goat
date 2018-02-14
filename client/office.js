import "./office/styles.less";
import "../static/favicon.ico";
import App from "./office/app";
import hydrate from "./shared/utils/hydrate";
import configureStore from "./office/store";


process.env.MODULE = "office";

const store = configureStore(window.__INITIAL_STATE__);

hydrate(App, store);

if (module.hot) {
	module.hot.accept("./office/app", () => {
		hydrate(App, store);
	});
}
