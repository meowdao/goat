import {wrapJSON} from "../../wrapper";
import OptOutController from "../../../controllers/mail/opt-out";


export default function (router) {
	const optOutController = new OptOutController();

	router.post("/optout/notifications", wrapJSON(::optOutController.change));
}
