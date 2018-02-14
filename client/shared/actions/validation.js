import {VALIDATION_REMOVE} from "../../../shared/constants/actions";

export default function removeValidation(data) {
	return dispatch =>
		dispatch({
			type: VALIDATION_REMOVE,
			data
		});
}
