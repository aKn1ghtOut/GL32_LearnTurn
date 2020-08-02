import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Accounts } from "meteor/accounts-base";
import { withTracker } from "meteor/react-meteor-data"

import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";


import "./main.scss";

import Footer from './components/Footer';
import CategorySidebar from "./components/CategorySidebar";
import LoginForm  from "./components/LoginForm"
import ClassPageContainer from './views/Classes';
import HomePage from './views/Home';
import Header from './components/Header';


const appHistory = createBrowserHistory();

class App extends Component {
	
render(){	
	if(!Meteor.userId()){
		return(<LoginForm />);

	} else {
		return (
			console.log(Meteor.user()),
			<Router history={appHistory}>
			<Header/>
			<CategorySidebar />
			<Switch>

			<Route path="/" exact component={HomePage} />
			<Route path="/home" component={HomePage}  />
			<Route path="/classes" component={ClassPageContainer}/>
				
			</Switch>
			<Footer/>
		</Router>
		)
	}
}	
};

const AppContainer = withTracker( () => {

	const userLogin = Meteor.subscribe("User.login");

	return {
		userLogin : Meteor.users.find({_id : Meteor.userId()}).fetch()
	};

})(App);


export default AppContainer;

Meteor.startup(() => {

	Accounts.createUser({
		username: "learnturn",
		password : "password"
	});
	
	
    render(<AppContainer />, document.getElementById('container'));

});
