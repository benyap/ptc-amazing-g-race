import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { NotFoundPage } from '../../pages';
import AppContainer from '../../../../../lib/react/components/AppContainer';
import Login from '../components/Login';
import Pay from '../components/Pay';
import Home from './Home';
import Register from './Register';
import Dashboard from './Dashboard';


class Registration extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AppContainer>
					<Switch>
						
						<Route exact path='/' component={Home}/>
						<Route exact path='/register' component={Register}/>
						<Route exact path='/login' component={Login}/>
						<Route exact path='/pay' component={Pay}/>
						<Route exact path='/dashboard' component={Dashboard}/>

						<Route component={NotFoundPage}/>

					</Switch>
				</AppContainer>
			</BrowserRouter>
		);
	}
}


export default Registration;
