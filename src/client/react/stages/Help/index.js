import React from 'react';
import { Position } from '@blueprintjs/core';
import MenuButton from '../../../../../lib/react/components/MenuButton';
import HelpMenu from './HelpMenu';

import '../../scss/_help.scss';


class Help extends React.Component {
	render() {
		return (
			<div id='help'>
				<div className='help-button'>
					<MenuButton buttonClass='pt-large' menu={<HelpMenu/>} iconName='cog' position={Position.BOTTOM_RIGHT}/>
				</div>
			</div>
		);
	}
}


export default Help;