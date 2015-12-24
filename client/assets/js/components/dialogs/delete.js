"use strict";

import React from "react";

export default class DeleteDialog extends React.Component {
	render() {
		return (
			<div className="modal fade" id="confirmDeletionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title" id="myModalLabel">Confirm delete</h4>
						</div>
						<div className="modal-body">
							<p>Are you sure?</p>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" id="buttonConfirmCancel" className="btn btn-primary">Cancel</button>
							<button type="button" data-dismiss="modal" id="buttonConfirmDelete" className="btn btn-danger">Delete</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

