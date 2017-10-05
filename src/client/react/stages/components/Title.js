import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

import '../../scss/components/_hero.scss';
import '../../../assets/images/hero-desktop-min.png';
import '../../../assets/images/hero-mobile-min.png';


const Title = ({notAnimated}) => {
	const title = (
		<div>
			<div className='title text padding'>
				<img src='/images/logo_white.png' alt='The Amazing Grace'></img>
				<p>
					The Amazing <br/><span className='em'>G</span>Race
				</p>
			</div>
			<div className='date text padding'>
				7th December, 2017
			</div>
		</div>
	);

	return (
		<div className='hero'>
			<div className='hero image'></div>
			{
				notAnimated ? 
				<div>
					{title}
				</div>
				:
				<ScrollAnimation animateOnce animateIn='fadeInDown' offset={0} duration={0.5}>
					{title}
				</ScrollAnimation>
			}
		</div>
	);
}


export default Title;
