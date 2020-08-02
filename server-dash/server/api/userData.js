import { Meteor } from "meteor/meteor";
import { number } from "prop-types";

import Sessions from "../models/Rooms";
import Rooms from "../models/Rooms";
import RTStatus from "../models/RTStatus"


Meteor.publish("User.login", function(){
    
    return Meteor.users.find({_id : Meteor.userId() });

});


Meteor.methods({
	
	'dataPacket.get'({looking,tabStatus,audioLevel}){

        check(looking, Boolean);
        check(tabStatus, Boolean);
        check(audioLevel, Number);

        let userId = Meteor.userId();
        let user = Meteor.users.find ({_id : userId}).fetch();

        let email = "";
        user.map((el) => email = el.email);
        
        let roomActive = Rooms.find({status : true, attendees : {$elemMatch: email}}).fetch();

        if(roomActive.length != 0){
            let roomId = "";
            roomActive.map(el => roomId = el._id);

            let sessionActive = Sessions.find({status:true, roomId: roomId });
            if(sessionActive.length != 0 ){
                let sessionId = "";
                sessionActive.map(el => sessionId = el._id);

                const checkEntry = RTStatus.find({user : {id : userId}}).fetch();

                if(checkEntry.length == 0 ){
                    RTStatus.insert ({
                        user : {
                            name : username,
                            id : userId
                        },
                        sessionId: sessionId, 
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : attentionQuotient
                    })
                } else {
                    RTStatus.update ({
                        user : {id : userId},
                        sessionId : sessionId
                    },
                    {
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : attentionQuotient
                    })
                }
            }


           
    
        }

       

        
        

	},
})