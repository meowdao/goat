import util from "util";
import winston from "winston";

winston.remove(winston.transports.Console);

function formatter(obj) {
	return (obj instanceof Error) ? `${obj.stack}` : util.inspect(obj, {depth: 10, colors: true});
}

winston.transports.Console.prototype.log = function log(level, msg, meta, callback) {
	const output = `${level.toUpperCase()} ${msg}${Object.keys(meta).length ? `\n${formatter(meta)}` : ""}`;

	if (this.stderrLevels[level]) {
		process.stderr.write(output + this.eol);
	} else {
		process.stdout.write(output + this.eol);
	}

	this.emit("logged");
	callback(null, true);
};

winston.setLevels(winston.config.syslog.levels);
winston.add(winston.transports.Console, {level: process.env.GOAT_DEBUG});
