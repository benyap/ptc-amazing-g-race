import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Icon, Intent } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../lib/react/components/MarkdownRenderer';
import { setStoryLiked } from '../../graphql/story';
import NotificationToaster from '../components/NotificationToaster';

import '../scss/components/_story.scss';


const LIKE_DOUBLE_TAP_TIMEOUT = 500;

const mapStateToProps = (state) => {
	return { username: state.auth.login.username };
}

@connect(mapStateToProps)
@graphql(setStoryLiked('ok'), { name: 'MutationSetStoryLiked' })
@autobind
class Story extends React.Component {
	constructor(props) {
		super(props);

		this._doubleTapTimeout = null;
		this.tapped = false;

		// Figure out likes
		let liked = false;
		props.story.likes.forEach((like) => {
			if (!liked && like === this.props.username) liked = true;
		})

		this.state = {
			liked: liked,
			likeLoading: false
		}
	}

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
		disableLike: PropTypes.bool,
		refetch: PropTypes.func.isRequired
	}

	static defaultProps = {
		disableLike: false
	}

	_withinMinutes(date, minutes) {
		const TIME = 1000 * 60 * minutes;
		const limit = Date.now() - TIME;
		return date > limit;
	}

	onClick() {
		if (!this.props.disableLike) {
			if (this.tapped) {
				// Double tapped
				this.tapped = false;
				this.submitLike();
			}
			else {
				this.tapped = true;

				if (this._doubleTapTimeout) clearTimeout(this._doubleTapTimeout);

				// Reset tap after a set amount of time
				this._doubleTapTimeout = setTimeout(() => {
					this.tapped = false;
				}, LIKE_DOUBLE_TAP_TIMEOUT);
			}
		}
	}

	async submitLike() {
		const prevLike = this.state.liked;

		this.setState((prevState) => {
			return { likeLoading: true, liked: !prevState.liked }
		});

		try {
			await this.props.MutationSetStoryLiked({
				variables: { storyId: this.props.story._id, like: !prevLike }
			});
			await this.props.refetch();
			this.setState({ likeLoading: false });
		}
		catch (err) {
			this.setState({ likeLoading: false });
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	render() {
		const { _id, type, createdBy, publishDate, iconName, intent, content, likes } = this.props.story;
		const date = publishDate ? new Date(publishDate) : new Date();
		let dateLabel;

		let liked = false;
		likes.forEach((like) => {
			if (!liked && like === this.props.username) liked = true;
		})

		if (this.state.likeLoading) liked = this.state.liked;

		if (this._withinMinutes(date, 60 * 24)) {
			if (this._withinMinutes(date, 60 * 4)) {
				if (this._withinMinutes(date, 90)) {
					if (this._withinMinutes(date, 45)) {
						if (this._withinMinutes(date, 15)) {
							if (this._withinMinutes(date, 5)) {
								if (this._withinMinutes(date, 2)) {
									dateLabel = 'A moment ago';
								}
								else dateLabel = 'A few minutes ago';
							}
							else dateLabel = 'About 10m ago';
						}
						else dateLabel = 'About 30m ago';
					}
					else dateLabel = 'About 1h ago';
				}
				else dateLabel = 'A few hours ago';
			}
			else dateLabel = DateFormat(date, 'h:MM TT');
		}
		else dateLabel = DateFormat(date, 'dd mmm');
		
		return (
			<div className={`pt-callout pt-intent-${intent} ${iconName?`pt-icon-${iconName}`:``} story`} onClick={this.onClick}>
				<div className='instruction-panel'>
					<MarkdownRenderer className='markdown-content' src={content}/>
					<div style={{margin:'0.2rem 0.2rem 0',display:'flex',justifyContent:'space-between'}}>
						<small className='pt-text-muted'>
							{dateLabel}
						</small>
						<small className='pt-text-muted'>
							{createdBy ? `${createdBy}` : `Auto-generated`} 
							&nbsp;&nbsp;
							<Icon iconName='heart' intent={liked?Intent.DANGER:Intent.NONE} onClick={this.submitLike}/>
							&nbsp;&nbsp;
							{likes.length}
						</small>
					</div>
				</div>
			</div>
		);
	}
}


export default Story;
