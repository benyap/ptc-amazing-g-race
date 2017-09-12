import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

import '../../scss/_description.scss';


class Description extends React.Component {
	render() {
		return (
			<div className='event-description'>
				<div className='details'>
					<ScrollAnimation animateOnce animateIn='fadeInUp' offset={0}>
						<h2>What is the<br/>Amazing (G)<span style={{fontWeight:400}}>Race</span>?</h2>
					</ScrollAnimation>
					<ScrollAnimation animateOnce animateIn='fadeInUp' offset={0}>
						The End of Year event run by students from Power To Change: <br/>
						<em> are you ready for the challenge?</em>
					</ScrollAnimation>
					<ScrollAnimation animateOnce animateIn='fadeInUp' offset={0}>
						Embark on a trek around the streets of Melbourne and participate in a series of challenges 
						with your team to unlock the path to victory... but you must choose your path wisely.
						Time is short and resources are limited. Will your team reign victorious over the others?
					</ScrollAnimation>
					<ScrollAnimation animateOnce animateIn='fadeInUp' offset={0}>
						<b>More details to come - get excited and stay tuned!</b>
					</ScrollAnimation>
				</div>
			</div>
		);
	}
}


export default Description;