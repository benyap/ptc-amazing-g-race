import React from 'react';
import { Menu, MenuItem } from "@blueprintjs/core";


class SettingsMenu extends React.Component {
	render() {
		return (
			<Menu>
				<MenuItem 
					iconName='log-out'
					text='Logout' 
					onClick={this.props.handleLogout}
				/>
			</Menu>
		);
	}
}


export default SettingsMenu;
