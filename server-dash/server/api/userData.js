import { Meteor } from "meteor/meteor";
import { number } from "prop-types";

import Rooms from "../models/Rooms";

Meteor.publish("User.login", function(){
    
    return Meteor.users.find({_id : Meteor.userId() });

});

