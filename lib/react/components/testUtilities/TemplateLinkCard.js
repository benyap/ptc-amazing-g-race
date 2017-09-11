import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import '../../scss/tests/_template-link-card.scss';


class TemplateLinkCard extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		to: PropTypes.string.isRequired
	}

	render() {
		const { title, description, to } = this.props;

		return (
			<div className='template-link-card'>
				<Link to={to}>
					<div class='pt-card pt-elevation-1 pt-interactive'>
						<h5>{title}</h5>
						{this.props.children}
					</div>
				</Link>
			</div>
		);
	}
}


export default TemplateLinkCard;
