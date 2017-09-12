import React from 'react';
import RegisterForm from './RegisterForm';
import Title from '../Title';

import '../../scss/_register.scss';


class Register extends React.Component {
	render() {
		return (
			<main>
				<Title/>
				<div className='registerform'>
					Register
					<RegisterForm/>
				</div>
			</main>
		);
	}
}


export default Register;
