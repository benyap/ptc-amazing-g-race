import React from 'react';
import RegisterForm from './RegisterForm';
import Title from '../Title';
import ScrollAnimation from 'react-animate-on-scroll';

import '../../scss/_register.scss';


class Register extends React.Component {
	render() {
		return (
			<main>
				<Title/>
				<ScrollAnimation animateOnce animateIn='zoomIn' offset={0}>
					<div className='registerform'>
						Register
						<RegisterForm/>
					</div>
				</ScrollAnimation>
			</main>
		);
	}
}


export default Register;
