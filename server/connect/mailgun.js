import q from "q";
import mailgun from "nodemailer-mailgun-transport";
import nodemailer from "nodemailer";
import {decorate, override} from "core-decorators";
import {promise} from "./abstract/decorators";
import AbstractAPI from "./abstract/abstract";


export default new class MailgunAPI extends AbstractAPI {

	static key = "MAILGUN_API";

	@override
	get client() {
		return nodemailer.createTransport(mailgun({auth: this.config}));
	}

	@decorate(promise)
	sendMail(message) {
		return q.nfcall(::this.client.sendMail, Object.assign(message, {from: this.config.from}));
	}
};
