import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import MenuButton from '../MenuButton';
import PlaceholderMenu from './PlaceholderMenu';


class PlaceholderSecondaryNav extends React.Component {
	render() {
		return (
			<div>
				{ this.props.authenticated ? 
					null :
					<Button className='pt-minimal' loading></Button>
				}
				{ this.props.authenticated ? 
					<Button className='pt-minimal'>Logout</Button> :
					<Button className='pt-minimal'>Login</Button>
				}
				<MenuButton 
					iconName={'cog'} 
					menu={<PlaceholderMenu/>} 
				/>
			</div>
		);
	}
}

export default PlaceholderSecondaryNav;
