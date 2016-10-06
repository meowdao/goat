import {wrapJSON} from "../../wrapper";
import TwitterController from "../../../controllers/blog/twitter";


export default function (router) {
	router.get("/twitter/search", wrapJSON(::TwitterController.getTwits));
}
