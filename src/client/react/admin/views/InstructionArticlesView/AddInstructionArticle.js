import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { compose, graphql } from 'react-apollo'
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import { addArticle } from '../../../../graphql/article';


@graphql(addArticle('_id'), { name: 'MutationAddArticle' })
@autobind
class AddInstructionArticle extends React.Component {
	static propTypes = {
		refetchArticles: PropTypes.func.isRequired
	}

	state = {
		showAddArticle: false,
		addArticleTitle: '',
		addArticleLoading: false,
		addArticleError: null
	}

	toggleAddArticle() {
		this.setState((prevState) => {
			return { 
				showAddArticle: !prevState.showAddArticle, 
				addArticleTitle: '',
				addArticleError: null
			};
		});
	}

	addArticleTitleEdit(e) {
		this.setState({ addArticleTitle: e.target.value });
	}

	async submitAddArticle() {
		if (this.state.addArticleTitle.length < 1) {
			this.setState({ addArticleError: 'Article title is required.' });
		}
		else {
			this.setState({ addArticleLoading: true, addArticleError: false });
			try {
				await this.props.MutationAddArticle({
					variables: {
						title: this.state.addArticleTitle,
						category: 'instructions',
						content: `# ${this.state.addArticleTitle}\n`
					}
				});

				await this.props.refetchArticles();
				this.setState({ addArticleLoading: false, showAddArticle: false });
			}
			catch (e) {
				this.setState({ addArticleError: e.toString(), addArticleLoading: false });
			}
		}
	}

	render() {
		return (
			<div>
				<Button text='Create Article' onClick={this.toggleAddArticle} intent={Intent.PRIMARY} iconName='clipboard' className='pt-minimal pt-fill'/>

				<Dialog title='Create a new article' isOpen={this.state.showAddArticle} iconName='clipboard' onClose={this.toggleAddArticle}>	
					<div className='pt-dialog-body'>
						{this.state.addArticleError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{this.state.addArticleError}
							</div>
							:null}
						<b>Article title:</b> <FormInput id='addArticle' value={this.state.addArticleTitle} onChange={this.addArticleTitleEdit} 
						intent={this.state.addArticleError ? Intent.DANGER : Intent.NONE}/>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button className='pt-minimal' text='Cancel' onClick={this.toggleAddArticle} disabled={this.state.addArticleLoading}/>
							<Button intent={Intent.PRIMARY} text='Create' onClick={this.submitAddArticle} loading={this.state.addArticleLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default AddInstructionArticle;