import React from "react";
import {hydrate} from "react-dom";
import {AppContainer} from "react-hot-loader";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import IntlWrapper from "../../../shared/intl/IntlWrapper";


export default (App, store) => {
	hydrate(
		<AppContainer>
			<Provider store={store}>
				<IntlWrapper>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</IntlWrapper>
			</Provider>
		</AppContainer>,
		document.getElementById("app")
	);
};
