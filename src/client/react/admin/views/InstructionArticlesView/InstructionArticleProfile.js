import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { compose, graphql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText, Dialog } from '@blueprintjs/core';
import { getArticle, setArticleTitle, editArticle } from '../../../../graphql/article';
import MarkdownEditor from '../../../../../../lib/react/components/MarkdownEditor';
import NotificationToaster from '../../../components/NotificationToaster';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DeleteInstructionArticle from './DeleteInstructionArticle';

import '../../../user/scss/components/_instruction-panel.scss';
import '../../scss/components/_markdown-preview.scss';


const QueryGetArticleParams = 'title content modified modifiedBy{username}';

const QueryGetArticleOptions = {
	name: 'QueryGetArticle',
	options: (props) => {
		return {
			variables: { category: 'instructions', articleId: props.article._id }
		}
	}
}

@compose(
	graphql(getArticle(QueryGetArticleParams), QueryGetArticleOptions),
	graphql(setArticleTitle('ok'), { name: 'MutationSetArticleTitle' }),
	graphql(editArticle('ok'), { name: 'MutationEditArticle' })
)
@autobind
class InstructionArticleProfile extends React.Component {
	static propTypes = {
		article: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired
		}).isRequired,
		refetchArticles: PropTypes.func.isRequired,
		closeProfile: PropTypes.func.isRequired
	}

	state = {
		saving: false,
		modified: false,
		titleText: this.props.article.title,
		content: null,
		showConfirmClose: false
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	closeProfile() {
		this.props.closeProfile();
	}

	toggleConfirmClose() {
		if (this.state.showConfirmClose) {
			this.setState({ showConfirmClose: false });
		}
		else {
			if (this.state.modified) {
				this.setState({ showConfirmClose: true });
			}
			else {
				this.closeProfile();
			}
		}
	}

	editTitle(value) {
		this.setState({ titleText: value });
	}

	confirmTitle(value) {
		if (value.length < 1) {
			this.setState({ titleText: this.props.article.title });
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: 'Title cannot be empty.'
			});
		}
		else {
			const options = {
				variables: {
					articleId: this.props.article._id,
					category: 'instructions',
					newTitle: this.state.titleText
				}
			};
			this._save(this.props.MutationSetArticleTitle, options);
		}
	}

	componentDidUpdate() {
		if (!this.state.content && this.props.QueryGetArticle.getArticle) {
			this.setState({content: this.props.QueryGetArticle.getArticle.content});
		}
	}

	editContent(event) {
		this.setState({content: event.target.value, modified: true});
	}

	saveContent() {
		this.setState({modified: false});
		const options = {
			variables: {
				articleId: this.props.article._id,
				category: 'instructions',
				content: this.state.content
			}
		};
		this._save(this.props.MutationEditArticle, options);
	}

	async _save(mutation, mutationOptions) {
		try {
			this.setState({saving: true});
			await mutation(mutationOptions);
	
			await this.props.QueryGetArticle.refetch();
			if (this._mounted) this.setState({saving: false});
		}
		catch (e) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
			if (this._mounted) this.setState({saving: false});
		}
	}

	render() {
		const { loading, getArticle } = this.props.QueryGetArticle;
		let content;

		if (getArticle) {
			content = (
				<div className='markdown-preview instruction-panel'>
					<MarkdownEditor title='Article Content' content={this.state.content || this.props.QueryGetArticle.getArticle.content} onChange={this.editContent}/>
			</div>
			);
		}
		else if (loading) {
			content = <LoadingSpinner/>;
		}

		return (
			<div className='pt-card instruction-article-profile'>
				<Button className='pt-minimal' intent={Intent.NONE} iconName='cross' onClick={this.toggleConfirmClose} style={{float:'right'}}/>
				<Button className='pt-minimal' intent={Intent.PRIMARY} iconName='floppy-disk' onClick={this.saveContent} style={{float:'right'}} disabled={!this.state.modified}/>
				<DeleteInstructionArticle articleId={this.props.article._id} refetchArticles={this.props.refetchArticles} closeProfile={this.closeProfile}/>
				{loading || this.state.saving ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }

				<h4>
					Title:&nbsp;
					<b>
						<EditableText value={this.state.titleText} onChange={this.editTitle} onConfirm={this.confirmTitle}/>
					</b>
				</h4>
				
				{content}

				{/* Confirm close dialog */}
				<Dialog isOpen={this.state.showConfirmClose} onClose={this.toggleConfirmClose} title='Unsaved changes'>
					<div className='pt-dialog-body'>
						Are you sure you want to close without saving?
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button intent={Intent.DANGER} className='pt-minimal' text='Close' onClick={this.closeProfile}/>
							<Button intent={Intent.PRIMARY} text='Cancel' onClick={this.toggleConfirmClose}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default InstructionArticleProfile;
