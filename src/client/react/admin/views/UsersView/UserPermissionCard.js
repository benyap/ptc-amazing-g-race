import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { removePermission } from '../../../../graphql/user';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(removePermission('ok'), {name: 'MutationRemovePermission'})
@autobind
class UserPermissionCard extends React.Component {
	static propTypes = {
		username: PropTypes.string.isRequired,
		permission: PropTypes.string.isRequired,
		refetchUser: PropTypes.func.isRequired
	}

	state = {
		showRemovePermission: false,
		removePermissionLoading: false,
		removePermissionError: null
	}

	toggleRemovePermission() {
		this.setState((prevState) => {
			return {
				showRemovePermission: !prevState.showRemovePermission,
				removePermissionError: null
			}
		});
	}

	async submitRemovePermission() {
		this.setState({removePermissionLoading: true, removePermissionError: null});
		try {
			await this.props.MutationRemovePermission({
				variables: {
					username: this.props.username,
					permission: this.props.permission
				}
			});
			await this.props.refetchUser();

			this.setState({removePermissionLoading: false, showRemovePermission: false});
		}
		catch (err) {
			if (this.state.showRemovePermission) {
				this.setState({
					removePermissionLoading: false, 
					removePermissionError: err.toString()
				});
			}
			else {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		return (
			<div>
				<span style={{whiteSpace:'nowrap'}}>
					<Button iconName='remove' className='pt-small pt-minimal' intent={Intent.DANGER} style={{padding:'0'}}
						onClick={this.toggleRemovePermission} loading={this.state.removePermissionLoading}/>
					<code style={{whiteSpace:'nowrap'}}>{this.props.permission}</code>
				</span>

				<Dialog title='Remove user permission' iconName='warning-sign'
					isOpen={this.state.showRemovePermission} onClose={this.toggleRemovePermission}>
					<div className='pt-dialog-body'>
						{this.state.removePermissionError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'1rem'}}>
								{this.state.removePermissionError}
							</div>
							:null}
							<p>
								Are you sure you want to remove the permission <code>{this.props.permission}</code> from the user?
							</p>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button className='pt-minimal' onClick={this.toggleRemovePermission} disabled={this.state.removePermissionLoading}>Cancel</Button>
							<Button className='pt-intent-danger' onClick={this.submitRemovePermission} loading={this.state.removePermissionLoading}>Remove</Button>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default UserPermissionCard;
