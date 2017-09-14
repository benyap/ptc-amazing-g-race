import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import AppContainer from '../../../../../lib/react/components/AppContainer';
import { NotFoundPage } from '../../pages';
import Home from './Home';
import Register from './Register';
import Pay from '../Pay';


class Registration extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AppContainer>
					<Switch>
						
						<Route exact path='/' component={Home}/>
						<Route exact path='/register' component={Register}/>
						<Route exact path='/pay' component={Pay}/>

						<Route component={NotFoundPage}/>

					</Switch>
				</AppContainer>
			</BrowserRouter>
		);
	}
}


export default Registration;
