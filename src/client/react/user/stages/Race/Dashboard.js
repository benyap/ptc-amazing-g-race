import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import Base from '../../components/Base';
import HelpMenu from '../../components/HelpMenu';
import Home from '../../views/Home';
import Help from '../../views/Help';
import Instructions from '../../views/Instructions';
import ImageUploaderTest from '../../views/ImageUploaderTest';
import NotFound from '../../views/NotFound';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Dashboard extends React.Component {

	render() {
		if (!this.props.authenticated) {
			return <Redirect to={{
				pathname: '/',
				state: { next: '/dashboard' }
			}}/>;
		}

		const { url } = this.props.match;

		return (
			<div className='pt-dark'>
				<Base/>
				<HelpMenu/>
				<Switch>
					<Route exact path={`${url}`} component={()=><Home/>}/>
					<Route path={`${url}/instructions`} component={()=><Instructions/>}/>
					<Route path={`${url}/feed`} component={()=>null}/>
					<Route path={`${url}/challenges`} component={()=>null}/>
					<Route path={`${url}/help`} component={()=><Help/>}/>
					<Route path={`${url}/image`} component={()=><ImageUploaderTest/>}/>
					<Route component={()=><NotFound/>}/>
				</Switch>
			</div>
		);
	}
}


export default Dashboard;