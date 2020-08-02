import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";

import "./HomeTable.scss";

import Rooms from "../../models/Rooms";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";


class AttentionUserInfo extends Component {

	componentWillReceiveProps(props)
	{
		console.log({props});
	}

	render() {

		return (

					<table className = "infoTable">
						<tbody>
							<tr>
								<th>Name</th>
								<th>Tab Status</th>
								<th>Looking</th>
								<th>Audio Level</th>
							</tr>
							{
								this.props.loading ? null :
								this.props.RTStatus.map(el => (
									<tr>
										<td>{el.username}</td>
										<td>{el.tabstatus ? "Yes" : "No"}</td>
										<td>{el.looking ? "Yes" : "No"}</td>
										<td>{Math.round(el.decibelLevel * 1000)}</td>
									</tr>
								)) 
							}
						</tbody>
					</table>
		)
	}
}

const AttentionContainer = withTracker( (props) => {

	const attention = Meteor.subscribe("AttentionDetails.get",props.sessionActive);
	const loading = attention.ready() ? false : true;
	
	return {
	  loading,
	  RTStatus: loading || RTStatus.find({}).fetch()
	};

})(AttentionUserInfo);



export default AttentionContainer;