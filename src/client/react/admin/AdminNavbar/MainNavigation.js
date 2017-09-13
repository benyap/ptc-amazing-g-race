import React from 'react';
import { Link } from 'react-router-dom';


const linkStyle = 'pt-button pt-minimal';

class MainNavigation extends React.Component {

	render() {
		return (
			<div>
				<a className={linkStyle + ' pt-icon pt-icon-key-escape'} href='/' target='_blank'>Visit site</a>
			</div>
		);
	}
}


export default MainNavigation;
