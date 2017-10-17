import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import MarkdownRenderer from '../../../../lib/react/components/MarkdownRenderer';

import '../scss/components/_story.scss';


class Story extends React.Component {
	static propTypes = {
		story: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			createdBy: PropTypes.string.isRequired,
			publishDate: PropTypes.string,
			iconName: PropTypes.string.isRequired,
			intent: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired,
			likes: PropTypes.array.isRequired
		}),
		disableLike: PropTypes.bool
	}

	static defaultProps = {
		disableLike: false
	}

	_withinMinutes(date, minutes) {
		const TIME = 1000 * 60 * minutes;
		const limit = Date.now() - TIME;
		return date > limit;
	}

	render() {
		const { _id, type, createdBy, publishDate, iconName, intent, content, likes } = this.props.story;
		const date = publishDate ? new Date(publishDate) : new Date();
		let dateLabel;

		if (this._withinMinutes(date, 60 * 24)) {
			if (this._withinMinutes(date, 60 * 4)) {
				if (this._withinMinutes(date, 90)) {
					if (this._withinMinutes(date, 45)) {
						if (this._withinMinutes(date, 15)) {
							if (this._withinMinutes(date, 5)) {
								if (this._withinMinutes(date, 2)) {
									dateLabel = 'Just a moment ago';
								}
								else dateLabel = 'A few minutes ago';
							}
							else dateLabel = 'About ten minutes ago';
						}
						else dateLabel = 'About half an hour ago';
					}
					else dateLabel = 'About an hour ago';
				}
				else dateLabel = 'A few hours ago';
			}
			else dateLabel = DateFormat(date, 'h:MM TT');
		}
		else dateLabel = DateFormat(date, 'dd mmm');
		
		return (
			<div className={`pt-callout pt-intent-${intent} ${iconName?`pt-icon-${iconName}`:``} story`}>
				<div className='instruction-panel'>
					<MarkdownRenderer className='markdown-content' src={content}/>
					<div style={{margin:'0.2rem 0.2rem 0',display:'flex',justifyContent:'space-between'}}>
						<small className='pt-text-muted'>
							{dateLabel}
						</small>
						<small className='pt-text-muted'>
							{createdBy ? `${createdBy}` : `Auto-generated`}
						</small>
					</div>
				</div>
			</div>
		);
	}
}


export default Story;
