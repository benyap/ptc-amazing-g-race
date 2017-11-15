import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import Base from '../../components/Base';
import HelpMenu from '../../components/HelpMenu';
import TeamDashboard from '../../views/TeamDashboard';
import About from '../../views/About';
import Contacts from '../../views/Contacts';
import Instructions from '../../views/Instructions';
import Feed from '../../views/Feed';
import Challenges from '../../views/Challenges';
import Challenge from '../../views/Challenge';
import NotFound from '../../views/NotFound';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Dashboard extends React.Component {
	 helpStyle = {
		background: 'rgba(95, 1, 1, 0.73)',
		color: 'white',
		borderRadius: '0'
	}

	render() {
		if (!this.props.authenticated) {
			return <Redirect to={{
				pathname: '/login',
				state: { next: '/dashboard' }
			}}/>;
		}

		const { url } = this.props.match;

		return (
			<div className='pt-dark'>
				<Base/>
				<HelpMenu/>
				<div style={this.helpStyle} className='pt-callout pt-icon-info-sign'>
					Welcome to the Amazing GRace app! 
					This is what it will look like during the race, 
					so make sure you know how to get around.
				</div>
				<Switch>
					<Route exact path={`${url}`} component={TeamDashboard}/>
					<Route exact path={`${url}/instructions`} component={Instructions}/>
					<Route exact path={`${url}/feed`} component={Feed}/>
					<Route exact path={`${url}/challenges`} component={Challenges}/>
					<Route exact path={`${url}/challenges/:id`} component={Challenge}/>
					<Route exact path={`${url}/about`} component={About}/>
					<Route exact path={`${url}/contacts`} component={Contacts}/>
					<Route component={NotFound}/>
				</Switch>
			</div>
		);
	}
}


export default Dashboard;
