import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";

import "./AttentionUserInfo.scss";

import Rooms from "../../models/Rooms";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";


class AttentionUserInfo extends Component {

	render() {

		return (

					<table className = "infoTable">
						<tbody>
							<tr>
								<th>Name</th>
								<th>Attention Status</th>
								<th>Login Time</th>
								<th>Average Attention</th>
							</tr>
							{
								this.props.loading ? null :
								this.props.RTStatus.map(el => {
									<tr>
										<td>{el.user.name}</td>
										<td><div className={`col-${el.attentionStatus}`}></div></td>
										<td>{el.joinedAt}</td>
										<td>{el.attentionQuotient}</td>
									</tr>
								}) 
							}
						</tbody>
					</table>
		)
	}
}

const AttentionContainer = withTracker( (props) => {

	const attention = Meteor.subscribe("AttentionDetails.get",props.sessionDisplayId);
	const loading = attention.ready() ? false : true;
	
	return {
	  loading,
	  RTStatus: loading || RTStatus.find({sessionId : props.sessionDisplayId}).fetch()
	};

})(AttentionUserInfo);



export default AttentionContainer;