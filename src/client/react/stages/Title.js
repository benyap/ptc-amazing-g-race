import React from 'react';

import '../scss/_hero.scss';


const Title = () => {
	return (
		<div className='hero'>
			<div className='hero image'></div>
			<div className='title text padding'>
			The Amazing (G)<span className='em'>Race</span>
			</div>
			<div className='date text padding'>
				7th December, 2017
			</div>
		</div>
	);
}


export default Title;
