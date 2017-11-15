import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NotFoundPage from '../../../pages/NotFound';
import AppContainer from '../../../../../../lib/react/components/AppContainer';
import Login from '../../components/Login';
import Home from './Home';
import Results from './Results';


class Race extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<AppContainer>
					<Switch>
						
						<Route exact path='/'>
							<Home/>
						</Route>
						<Route exact path='/login'>
							<Login notAnimated next='/results'/>
						</Route>

						<Route path='/results' component={Results}/>
						
						<Route component={NotFoundPage}/>

					</Switch>
				</AppContainer>
			</BrowserRouter>

		);
	}
}


export default Race;
