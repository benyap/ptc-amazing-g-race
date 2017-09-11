import React from 'react';
import { Link } from 'react-router-dom';


class PlaceholderMainNav extends React.Component {
	render() {
		return (
			<div>
				<Link className='pt-button pt-minimal pt-navbar-heading pt-icon-home' to='#'>
					{ this.props.authenticated ?
						'Hello friend' : 'Stranger Danger' }
				</Link>
				<Link className='pt-button pt-minimal' to='#'>Resources</Link>
				<Link className='pt-button pt-minimal' to='#'>About</Link>
				<Link className='pt-button pt-minimal' to='#'>Contact</Link>
			</div>
		);
	}
}

export default PlaceholderMainNav;
