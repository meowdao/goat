import fetch from "isomorphic-fetch";
import {MESSAGE_ADD, MESSAGE_ADD_ALL, VALIDATION_ADD_ALL} from "../../../shared/constants/actions";

function readCookie(name) {
	const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
	return match ? decodeURIComponent(match[3]) : null;
}

export default ({action, storeName, method = "GET", name, data = {}}, dispatch) => {
	// console.log("FETCH", action, storeName, method, name, data);

	// TODO CORS
	const _url = new URL(`${document.location.protocol}//${document.location.host}/api${action}`);

	if (method === "GET") {
		Object.keys(data).forEach(key => _url.searchParams.append(key, data[key]));
	}

	console.log(method, _url.href, method, JSON.stringify(data));

	dispatch({
		type: `${storeName}_${name}_start`,
		name,
		isLoading: true,
		success: false,
		data
	});

	return fetch(_url, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json; charset=utf-8",
			"X-XSRF-TOKEN": readCookie("XSRF-TOKEN")
		},
		credentials: "same-origin",
		method,
		body: method === "GET" ? void 0 : JSON.stringify(data)
	})
		.then(response =>
			response.json().then(json => {
				if (response.status === 200) {
					dispatch({
						type: `${storeName}_${name}_success`,
						name,
						isLoading: false,
						success: true,
						data: json
					});
				} else {
					dispatch({
						type: response.status === 409 ? VALIDATION_ADD_ALL : MESSAGE_ADD_ALL,
						data: json.errors.map(e => Object.assign(e, {status: response.status}))
					});
					dispatch({
						type: `${storeName}_${name}_error`,
						name,
						isLoading: false,
						success: false
					});
				}
			})
		)
		.catch(error => {
			dispatch({
				type: MESSAGE_ADD,
				data: error
			});
			dispatch({
				type: `${storeName}_${name}_error`,
				name,
				isLoading: false,
				success: false
			});
		});
};
