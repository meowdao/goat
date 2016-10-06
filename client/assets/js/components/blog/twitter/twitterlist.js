import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {Table} from "react-bootstrap";
import moment from "moment-config-trejgun";


@connect(
	state => ({
		twits: state.twits
	})
)
export default class TwitterList extends React.Component {

	static propTypes = {
		twits: PropTypes.array

	};

	static defaultProps = {
		twits: []
	};

	renderItem(item, i) {
		return (
			<div key={i}>
				<h5>
					<a href={`https://twitter.com/statuses/${item.id_str}`}>
						{moment(new Date(item.created_at)).format("YYYY-MM-DD HH:mm")}
					</a>
					<span> - {item.user.name}</span>
				</h5>
				<Table responsive>
					<tbody>
					<tr>
						<td>
							<a href={`https://twitter.com/${item.user.screen_name}`}>
								<img src={item.user.profile_image_url}/>
							</a>
						</td>
						<td>{item.text}</td>
					</tr>
					</tbody>
				</Table>
			</div>
		);
	}

	render() {
		return (
			<div className="row">
				<div className="col-sm-7">
					{this.props.twits.map(this.renderItem)}
				</div>
			</div>
		);
	}

}
