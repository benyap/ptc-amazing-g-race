import React from 'react';

const HelpBox = ({showHelp}) => {
	if (showHelp) {
		return (
			<div className='pt-callout pt-icon-help pt-intent-primary'>
				Here you can see an overview of your team's progress
				and any important announcements.
				Open the menu in the top right corner to navigate to other pages.
				<br/>
				<br/>
				You can also use the refresh button to refresh the data displayed throughout the app.
				Don't stress about your data usage - each refresh only uses around 1000 bytes, which is 0.1% of 1mb! 
			</div>
		);
	}
	else return null;
}

export default HelpBox;
