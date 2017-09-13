import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

import '../scss/_hero.scss';


const Title = () => {
	return (
		<div className='hero'>
			<div className='hero image'></div>
			<ScrollAnimation animateOnce animateIn='fadeInDown' offset={0}>
				<div className='title text padding'>
					<img src='/images/logo/logo_white.png' alt='The Amazing Grace'></img>
					<p>
						The Amazing <br/><span className='em'>G</span>Race
					</p>
				</div>
				<div className='date text padding'>
					7th December, 2017
				</div>
			</ScrollAnimation>
		</div>
	);
}


export default Title;
