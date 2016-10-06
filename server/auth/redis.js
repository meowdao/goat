import winston from "winston";
import redis from "redis";
import configs from "../configs/config";


export default function () {
	const config = configs[process.env.NODE_ENV];
	const client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

	client.on("error", error => {
		winston.info(error);
	});

	client.on("connect", () => {
		winston.info("connect on host", config.redis.host);
	});

	client.on("ready", () => {
		winston.info("redis is ready");
	});

	return client;
}
