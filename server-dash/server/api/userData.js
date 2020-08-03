import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { number } from "prop-types";

import Sessions from "../models/Sessions";
import Rooms from "../models/Rooms";
import RTStatus from "../models/RTStatus";
import DataPacket from "../models/DataPacket"


Meteor.publish("User.login", function(){
    
    return Meteor.users.find({_id : Meteor.userId() });

});

Meteor.publish("dataPackets.get", function(){
    
    let sessionActive = Sessions.find({status:true, userId : Meteor.userId()}).fetch();
    let sessionId = sessionActive[0]._id;
    return DataPacket.find({sessionId : sessionId});

});


Meteor.methods({
	
	'dataPacket.get'(params){

        const {looking,tabStatus,audioLevel} = params;

        check(looking, Boolean);
        check(tabStatus, Boolean);
        check(audioLevel, Number);

        let userId = Meteor.userId();
        let user = Meteor.users.find({_id : userId}).fetch();

        let email = "";
        user.map((el) => email = el.email);
        
        let roomActive = Rooms.find({status : true, attendees: email }).fetch();

        if(roomActive.length != 0){
            let roomId = roomActive[0]._id;

            let sessionActive = Sessions.find({status:true, roomId: roomId }).fetch();

            if(sessionActive.length != 0 ){
                let sessionId = sessionActive[0]._id;

                let checkEntry = RTStatus.find({userId : userId,sessionId: sessionId}).fetch();

                console.log(checkEntry);

                DataPacket.insert({
                    userId : userId,
                    sessionId : sessionId,
                    username : "Moksh",
                    onsceen : looking,
                    tabstatus : tabStatus,
                    decibelLevel : audioLevel
                });

                if(checkEntry.length == 0 ){

                    console.log({
                        userId : userId,
                        username : "moksh",
                        sessionId: sessionId, 
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : 0
                    });

                    RTStatus.insert ({
                        userId : userId,
                        username : "moksh",
                        sessionId: sessionId, 
                        sessionId: sessionId, 
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : 0
                    })
                } else {

                    console.log({
                        userId : userId,
                        username : "moksh",
                        sessionId: sessionId, 
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : 0
                    });

                    RTStatus.update ({
                        userId : userId,
                        sessionId : sessionId
                    },
                    {
                        $set : {
                            onsceen : looking,
                            tabstatus : tabStatus,
                            decibelLevel : audioLevel,
                            attentionQuotient : 0
                        }
                       
                    })
                }
            }
        }
	},
})