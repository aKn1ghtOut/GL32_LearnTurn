import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import PropTypes, { func } from "prop-types";

import "./Rooms.scss";

import Rooms from "../../models/Rooms";

import RoomInfo from "../../components/RoomInfo";

class Class1 extends Component {

	constructor(){
		super()
		this.state =  {
			title: ""	
		}
	}

	addRoom(){
		
		if( this.state.title.length < 5){
			alert('the title must be atleast 5 characters');
		}
		else{
			Meteor.call('Room.add',this.state.title);
		}

		document.getElementById("roomTitle").value = "";
	}

	changeRoomActive(roomId){
		Meteor.call('Room.activeChange',roomId);
	}

	render() {

		return (

			<div className = "homeContainer">
				<div className = "RoomsContainer">
									
					{
						this.props.loading ? null :
						this.props.rooms.map((el) => {
							
							return <button onClick={() => this.changeRoomActive(el._id)}>{el.title}<FontAwesomeIcon className="icon" icon={faUsers}/></button>
					
						})

					}
					
					
					<button onClick={() => this.addRoom()} className="createRoom">
						Create New Room
					</button>
					<input onChange={(e) => this.setState({title : e.currentTarget.value})} placeholder="Room Title" id="roomTitle"></input>
					
				</div>
					
				{
						this.props.loading ? null :
						this.props.roomActive.map((el) => {
							if(el.status == true)
								return <RoomInfo sessArr = {el.sessions} count = {el.sessions.length} />
						})
				}
				
			</div>

		)
	}
}

const RoomsContain = withTracker( () => {

	const rooms = Meteor.subscribe("Rooms.get");
	const loading = rooms.ready() ? false : true;

	return {
	loading,
	  rooms : loading || Rooms.find({owner : {uid: Meteor.userId()}}).fetch(),
	  roomActive : loading || Rooms.find({owner : {uid: Meteor.userId()},status : true}).fetch(),
	  
	};

})(Class1);


export default RoomsContain;