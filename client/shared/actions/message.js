import {MESSAGE_ADD, MESSAGE_REMOVE} from "../../../shared/constants/actions";


export const messageShow = data =>
	dispatch =>
		dispatch({
			data,
			type: MESSAGE_ADD
		});

export const messageRemove = data =>
	dispatch =>
		dispatch({
			data,
			type: MESSAGE_REMOVE
		});
