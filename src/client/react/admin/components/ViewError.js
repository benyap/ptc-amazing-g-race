import React from 'react';


export default ({ error }) => {
	let iconName, errorTitle, errorDescription;
	if (error.message.indexOf('No user logged in') >= 0) {
		iconName = 'error';
		errorTitle = 'Invalid access token';
		errorDescription = 'Your session may have expired. Please refresh this page or log in again.';
	}
	else if (error.message.indexOf('Permission denied') >= 0) {
		iconName = 'ban-circle';
		errorTitle = 'Permission denied';
		errorDescription = 'You do not have the correct permissions on your account to view these settings.';
	}
	
	return (
		<div className='pt-non-ideal-state'>
			<div className='pt-non-ideal-state-visual pt-non-ideal-state-icon'>
				<span className={'pt-icon pt-icon-' + iconName}></span>
			</div>
			<h4 className='pt-non-ideal-state-title'>
				{errorTitle}
			</h4>
			<div className='pt-non-ideal-state-description'>
				{errorDescription}
			</div>
		</div>
	);
}
