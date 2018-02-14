import {Router} from "express";
import {wrapJSON} from "../../../shared/utils/wrapper";
import {methodNotAllowed} from "../../../shared/utils/middleware";
import SNSController from "../../../mail/controllers/sns";

const router = Router(); // eslint-disable-line new-cap
const snsController = new SNSController();

router.route("/sns/:type(bounces|complaints|deliveries)")
	.post(wrapJSON(request =>
		snsController.create(JSON.parse(request.body))
	))
	.all(methodNotAllowed);

export default router;
