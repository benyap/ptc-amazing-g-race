import React from 'react';
import Title from '../../components/Title';
import Description from '../../components/Description';
import ScrollAnimation from 'react-animate-on-scroll';


class Home extends React.Component {
	render() {
		return (
			<main>
				<Title/>
				<ScrollAnimation animateOnce animateIn='fadeInDown' offset={0} duration={0.5}>
					<div className='infobox text padding'>
						Registration opens
						<br/>
						<span className='em'>Monday 18th September</span>
					</div>
				</ScrollAnimation>
				<Description/>
			</main>
		);
	}
}


export default Home;
