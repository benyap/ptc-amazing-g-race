import React from 'react';
import RegisterForm from './RegisterForm';
import Title from '../../components/Title';
import ScrollAnimation from 'react-animate-on-scroll';

import '../../../scss/components/_register.scss';


class Register extends React.Component {
	render() {
		return (
			<main>
				<Title notAnimated/>
				<ScrollAnimation animateOnce animateIn='zoomIn' offset={0} duration={0.5}>
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
