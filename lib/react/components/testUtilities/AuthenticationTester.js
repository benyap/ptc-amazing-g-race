import React from 'react';

import AuthenticationDispatcher from './AuthenticationDispatcher';
import Authenticated from '../utility/Authenticated';
import AuthenticationStatus from '../utility/AuthenticationStatus';

import '../../scss/tests/_authentication-tester.scss';


class AuthenticationTester extends React.Component {
	render() {
		return (
			<div className='authentication-tester'>
				<Authenticated>
					<AuthenticationDispatcher/>
					<AuthenticationStatus/>
				</Authenticated>
			</div>
		);
	}
}


export default AuthenticationTester;
