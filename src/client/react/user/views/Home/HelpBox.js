import React from 'react';
import { Link } from 'react-router-dom';

const HelpBox = ({showHelp}) => {
	if (showHelp) {
		return (
			<div className='pt-callout pt-icon-help pt-intent-primary'>
				Here you can see an overview of your team's progress.
				Open the menu in the top right corner to navigate to other pages.
				<br/>
				<br/>
				You can also use the refresh button to refresh the data displayed throughout the app.
				If you're concerned about data usage, check out the raw facts <Link to='/dashboard/about'>here</Link>.
			</div>
		);
	}
	else return null;
}

export default HelpBox;
