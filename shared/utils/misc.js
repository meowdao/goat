import server from "../../server/shared/configs/server";

export function formatUrl({protocol, hostname, port} = {}) {
	// url.format puts port 80 which we don't need
	return `${protocol}://${hostname}${[80, "80", 443, "443"].includes(port) ? "" : `:${port}`}`;
}

export function getServerUrl(name) {
	return formatUrl(server[process.env.NODE_ENV][name]);
}
