import fetch from "../utils/fetch";


export default function doAjaxAction({data, storeName, action = "view", method = "GET", name}) {
	return dispatch =>
		fetch({
			action,
			method,
			data,
			storeName,
			name
		}, dispatch);
}
