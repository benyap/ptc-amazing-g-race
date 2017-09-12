import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

import '../scss/_hero.scss';


const Title = () => {
	return (
		<div className='hero'>
			<div className='hero image'></div>
			<ScrollAnimation animateOnce animateIn='fadeInDown' offset={0}>
				<div className='title text padding'>
					The Amazing (G)<span className='em'>Race</span>
				</div>
				<div className='date text padding'>
					7th December, 2017
				</div>
			</ScrollAnimation>
		</div>
	);
}


export default Title;
