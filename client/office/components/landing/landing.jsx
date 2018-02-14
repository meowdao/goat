import React, {Component} from "react";
import {companyName} from "../../../../shared/constants/misc";
import {getServerUrl} from "../../../../shared/utils/misc";
import "./landing.less";


export default class Landing extends Component {
	render() {
		return (
			<header className="intro-header landing" style={{backgroundImage: `url("${getServerUrl("cdn")}/img/${process.env.MODULE}/landing/intro-bg.jpg")`}}>
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="intro-message">
								<h1>{companyName}</h1>
								<h3>It&apos;s alive!</h3>
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	}
}
