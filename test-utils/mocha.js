import winston from "winston";
import bluebird from "bluebird";
import mongoose from "mongoose";
import "../server/shared/configs/winston";

Error.stackTraceLimit = Infinity;

winston.error(`Test date: ${new Date().toISOString()}`);

bluebird.config({
	warnings: true,
	longStackTraces: true,
	cancellation: true,
	monitoring: true
});

mongoose.set("debug", false);

process.on("uncaughtException", winston.error);
