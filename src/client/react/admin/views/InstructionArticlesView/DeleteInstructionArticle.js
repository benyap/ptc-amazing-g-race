import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { removeArticle } from '../../../../graphql/article';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(removeArticle('ok'), { name: 'MutationRemoveArticle' })
@autobind
class DeleteInstructionArticle extends React.Component {
	static propTypes = {
		articleId: PropTypes.string.isRequired,
		refetchArticles: PropTypes.func.isRequired,
		closeProfile: PropTypes.func.isRequired
	}

	state = {
		showConfirmDelete: false,
		deleteLoading: false
	}

	toggleConfirmDelete() {
		this.setState((prevState) => {
			return { showConfirmDelete: !prevState.showConfirmDelete };
		});
	}

	async submitDeleteArticle() {
		this.setState({ deleteLoading: true });
		try {
			await this.props.MutationRemoveArticle({
				variables: {
					articleId: this.props.articleId,
					category: 'instructions'
				}
			});
			await this.props.refetchArticles();
			this.props.closeProfile();
		}
		catch(err) {
			this.setState({ deleteLoading: false });
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: e.toString()
			});
		}
	}

	render() {
		return (
			<span>
				<Button className='pt-minimal' intent={Intent.DANGER} iconName='trash' onClick={this.toggleConfirmDelete} style={{float:'right'}}/>

				<Dialog isOpen={this.state.showConfirmDelete} onClose={this.toggleConfirmDelete} title='Delete article'>
					<div className='pt-dialog-body'>
						Are you sure you want to delete this article? This action is irreversible.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleConfirmDelete} className='pt-minimal' disabled={this.state.deleteLoading}/>
							<Button text='Delete' onClick={this.submitDeleteArticle} intent={Intent.DANGER} loading={this.state.deleteLoading}/>
						</div>
					</div>
				</Dialog>
			</span>
		);
	}
}


export default DeleteInstructionArticle;
