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

	render() {
		const { _id, type, createdBy, publishDate, iconName, intent, content, likes } = this.props.story;
		let date = publishDate ? new Date(publishDate) : new Date();

		return (
			<div className={`pt-callout pt-intent-${intent} ${iconName?`pt-icon-${iconName}`:``} story`}>
				<div className='instruction-panel'>
					<MarkdownRenderer className='markdown-content' src={content}/>
					<div style={{margin:'0.2rem 0.2rem 0',display:'flex',justifyContent:'space-between'}}>
						<small className='pt-text-muted'>
							{DateFormat(date, 'h:MM TT')}
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
