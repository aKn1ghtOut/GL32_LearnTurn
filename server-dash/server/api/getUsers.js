import { Meteor } from "meteor/meteor";

import Users from "../models/Users";
import { check } from "meteor/check";


Meteor.publish("Users.get", function(){
    
    const query = { }; 
	return Users.find(query);

});