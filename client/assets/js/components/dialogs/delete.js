"use strict";

import React from "react";

class DeleteDialog extends React.Component {
	render() {
		return (
			<div class="modal fade" id="confirmDeletionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 class="modal-title" id="myModalLabel">Confirm delete</h4>
						</div>
						<div class="modal-body">
							<p>Are you sure?</p>
						</div>
						<div class="modal-footer">
							<button type="button" data-dismiss="modal" id="buttonConfirmCancel" class="btn btn-primary">Cancel</button>
							<button type="button" data-dismiss="modal" id="buttonConfirmDelete" class="btn btn-danger">Delete</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DeleteDialog;
