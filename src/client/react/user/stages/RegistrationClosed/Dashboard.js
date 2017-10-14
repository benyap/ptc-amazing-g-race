import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import Base from '../../components/Base';
import HelpMenu from '../../components/HelpMenu';
import Home from '../../views/Home';
import Help from '../../views/Help';
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
					What you're seeing on this page is a template of how the app will look like on game day.
				</div>
				<Switch>
					<Route exact path={`${url}`} component={Home}/>
					<Route exact path={`${url}/instructions`} component={Instructions}/>
					<Route exact path={`${url}/feed`} component={Feed}/>
					<Route exact path={`${url}/challenges`} component={Challenges}/>
					<Route exact path={`${url}/challenges/:id`} component={Challenge}/>
					<Route exact path={`${url}/help`} component={Help}/>
					<Route exact path={`${url}/contacts`} component={Contacts}/>
					<Route component={NotFound}/>
				</Switch>
			</div>
		);
	}
}


export default Dashboard;
