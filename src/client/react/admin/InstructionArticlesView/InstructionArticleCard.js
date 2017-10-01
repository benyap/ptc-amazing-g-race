import React from 'react';
import PropTypes from 'prop-types';
import DateFormat from 'dateformat';
import { autobind } from 'core-decorators';


@autobind
class InstructionArticleCard extends React.Component {
	static propTypes = {
		article: PropTypes.shape({
			_id: PropTypes.string,
			title: PropTypes.string
		}).isRequired,
		renderProfile: PropTypes.func.isRequired
	};

	openProfile() {
		this.props.renderProfile(this.props.article);
	}

	render() {
		const { title, modifiedBy, modified, createdBy, created } = this.props.article;
		let date;
		if (modified) date = DateFormat(new Date(modified), 'mmm dd yyyy hh:MM:ss TT');
		else date = DateFormat(new Date(created), 'mmm dd yyyy hh:MM:ss TT');

		return (
			<div className='pt-card pt-elevation-0 pt-interactive user-card' onClick={this.openProfile}>
				<h5>
					{`${title}`}
				</h5>
				<p className='pt-text-muted'>
					{ modifiedBy ? 
						`Last modified by ${modifiedBy.username} on ${date}` : 
						`Created by ${createdBy.username} on ${date}`
					}
				</p>
			</div>
		);
	}
}


export default InstructionArticleCard;
