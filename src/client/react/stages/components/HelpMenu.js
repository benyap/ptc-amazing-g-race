import React from 'react';
import { Position, Menu, MenuItem } from '@blueprintjs/core';
import MenuButton from '../../../../../lib/react/components/MenuButton';

import '../../scss/_help.scss';


class HelpMenu extends React.Component {
	menu = (
		<Menu>
			<MenuItem text='Test'/>
			<MenuItem text='Test'/>
			<MenuItem text='Test'/>
			<MenuItem text='Test'/>
		</Menu>
	);

	render() {
		return (
			<div id='help'>
				<div className='help-button'>
					<MenuButton buttonClass='pt-large' menu={this.menu} iconName='cog' position={Position.BOTTOM_RIGHT}/>
				</div>
			</div>
		);
	}
}


export default HelpMenu;