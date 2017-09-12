import React from 'react';
import RegisterForm from './RegisterForm';

import '../../scss/_hero.scss';
import '../../scss/_register.scss';

class Home extends React.Component {
	render() {
		return (
			<main className='hero'>
				<div className='hero image'></div>
				<div className='title text padding'>
					The Amazing G<span className='em'>Race</span>
				</div>
				<div className='date text padding'>
					7th December, 2017
				</div>
				<div className='registerform'>
					Register
					<RegisterForm/>
				</div>
			</main>
		);
	}
}


export default Home;
