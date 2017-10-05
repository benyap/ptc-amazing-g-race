import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

import '../scss/components/_base.scss';
import '../../../assets/images/logo/logo_white.png';


const Base = () => {
	const title = (
		<div id='base'>
			<div className='title text'>
				<img src='/images/logo_white.png' alt='The Amazing Grace'></img>
				<p>
					The Amazing <br/><span className='em'>G</span>Race
				</p>
			</div>
		</div>
	);

	return (
		<div className='hero'>
			<div className='hero image'></div>
			<div>{title}</div>
		</div>
	);
}


export default Base;
