import axios from 'axios';
import { Intent } from '@blueprintjs/core';
import NotificationToaster from './NotificationToaster';
import API from '../../API';


export default async (accessToken, refreshToken, showNotifications = true) => {
	const config = {
		url: API.api,
		method: 'POST',
		timeout: 30000,
		headers: { Authorization: `Bearer ${accessToken}` },
		data: {
			variables: { refreshToken },
			query: 
			`mutation LogoutUser($refreshToken:String!) { 
				logout(refreshToken:$refreshToken) {
					ok failureMessage
				}
			}`
		}
	}

	// Send logout request to server
	const result = await axios(config);
	
	// Handle any errors
	if (result.data.data.logout && !result.data.data.logout.ok) {
		if (showNotifications) {
			NotificationToaster.show({
				intent: Intent.WARNING,
				message: result.data.data.logout.failureMessage
			});
		}
		else console.warn(result.data.data.logout.failureMessage);
	}
	else if (result.data.errors) {
		if (showNotifications) {
			NotificationToaster.show({
				intent: Intent.WARNING,
				message: result.data.errors[0].message
			});
		}
		else console.warn(result.data.errors[0].message);
	}
}
