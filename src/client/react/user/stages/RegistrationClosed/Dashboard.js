import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import Base from '../../components/Base';
import HelpMenu from '../../components/HelpMenu';
import Home from '../../views/Home';
import Help from '../../views/Help';
import Instructions from '../../views/Instructions';
import NotFound from '../../views/NotFound';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Dashboard extends React.Component {
	 helpStyle = {
		marginBottom: '1rem',
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
					<Route exact path={`${url}`} component={()=><Home demo/>}/>
					<Route path={`${url}/instructions`} component={()=><Instructions demo/>}/>
					<Route path={`${url}/feed`} component={()=>null}/>
					<Route path={`${url}/challenges`} component={()=>null}/>
					<Route path={`${url}/help`} component={()=><Help demo/>}/>
					<Route component={NotFound}/>
				</Switch>
			</div>
		);
	}
}


export default Dashboard;
