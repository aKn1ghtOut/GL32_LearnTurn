import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Rooms from "../../models/Rooms";

import './Home.scss'

import ListProductsContainer from "../../components/ListProducts";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";
import HomeTable from "../../components/HomeTable"





class HomePage extends Component
{
	
	render()
	{
		return (

			<div className=" home-container">
				{/* <div className = "tableContainer">
					<table className = "infoTable">
						<tbody>
							<tr>
								<th>Name</th>
								<th>Attendance Status</th>
								<th>Tab Status</th>
								<th>Audio Status</th>
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
				</div> */}

				{/* <HomeTable  sessionActive = {
					this.props.loading ? null :
					this.props.sessionActive[0]._id
					}/> */}

			</div>
		)
	}
}

const HomePageContainer = withTracker( (props) => {

	const sessionActive = Meteor.subscribe('Sessions.get');
	const loading = sessionActive.ready() ? false : true ;
	console.log(Sessions.find({status: true, owner : {uid : Meteor.userId()}}).fetch())
	return {
		loading, 
		sessionActive : loading || Sessions.find({status: true, owner : {uid : Meteor.userId()}}).fetch()
	};

})(HomePage);

export default HomePageContainer;