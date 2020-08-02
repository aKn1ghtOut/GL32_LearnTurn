import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";

import "./RoomInfo.scss";
import AttentionUserInfo from "../AttentionUserInfo"

import Rooms from "../../models/Rooms";
import Sessions from "../../models/Sessions";



class Room1 extends Component {

	constructor(props){
		super(props);

		this.state = {
			count : this.props.count - 1,
			sessionArr : this.props.sessArr
		};
	
	}
 
	createSession(){
		Meteor.call('Session.add');
		
	}

	endSession(){
		Meteor.call('Session.end');
	}

	sessionLeft(){
		if(this.state.count != 0)
			this.setState({count : (this.state.count - 1)});
		console.log('gfdgv')
	}

	sessionRight(){
		if(this.state.count !== (this.props.count - 1 ))
			this.setState({count : this.state.count + 1})
	}

	

	render() {

		return (
			
			<div className = "tableContainer">
			
				<div className = "buttonContainer">
					<button>Add Students</button>
					<button onClick = {() => this.createSession()}>Start Session</button>
					<button onClick = {() => this.endSession()}>Stop Session</button>
				</div>

				<div className = "sessionInfo">

				<div className= 'sessionDetails'>
					<div>
					<FontAwesomeIcon onClick = {() => this.sessionLeft} className="left" icon={faCaretSquareRight}/>
					<h2>	Session - 
							{ 
								this.state.sessionArr[this.state.count]
								
							}
							
					</h2>
					<FontAwesomeIcon onClick = {() => this.sessionRight} className="right" icon={faCaretSquareRight}/>
					</div>
				</div>
				
				

				<AttentionUserInfo sessionDisplayId={this.state.sessionId}/>

				</div>
			</div>

		)
		

	}
}

const SessionSlider = withTracker( () => {

	const sessions = Meteor.subscribe("Sessions.get");
	const rooms = Meteor.subscribe("Room.getActive");
	const loading = rooms.ready() ? false : true;
	
	return {
	  loading,
	  room: loading || Rooms.find( { owner: {uid : Meteor.userId()}, status:true }).fetch()
	};

})(Room1);



export default SessionSlider;