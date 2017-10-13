import React from 'react';

const HelpBox = ({username, showHelp}) => {
	if (showHelp) {
		return (
			<div className='pt-callout pt-icon-help pt-intent-primary'>
				<h5>Welcome to your dashboard, {username}</h5>
				Here you can see an overview of your team's progress
				and any important announcements.
				Open the menu in the top right corner to navigate to other pages.
				<br/>
				<br/>
				Use the refresh button to refresh the data displayed.
				Don't stress about your data usage - 
				each refresh only uses around 1000 bytes, which is 0.1% of 1mb! 
			</div>
		);
	}
	else return null;
}

export default HelpBox;
