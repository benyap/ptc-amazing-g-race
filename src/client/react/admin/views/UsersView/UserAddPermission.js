import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { addPermission } from '../../../../graphql/user';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(addPermission('ok'), {name: 'MutationAddPermission'})
@autobind
class UserAddPermission extends React.Component {
	static propTypes = {
		username: PropTypes.string.isRequired,
		refetchUser: PropTypes.func.isRequired
	}

	state = {
		showAddPermission: false,
		addPermissionText: '',
		addPermissionLoading: false,
		addPermissionError: null
	}

	toggleAddPermission() {
		this.setState((prevState) => {
			return {
				showAddPermission: !prevState.showAddPermission,
				addPermissionError: null,
				addPermissionText: ''
			}
		});
	}

	addPermissionChange({ target: { value }}) {
		this.setState({addPermissionText: value});
	}
	
	async submitAddPermission() {
		this.setState({addPermissionLoading: true, addPermissionError: null});
		try {
			await this.props.MutationAddPermission({
				variables: {
					username: this.props.username,
					permission: this.state.addPermissionText
				}
			});
			await this.props.refetchUser();

			this.setState({addPermissionLoading: false, showAddPermission: false});
		}
		catch (err) {
			if (this.state.showAddPermission) {
				this.setState({
					addPermissionLoading: false, 
					addPermissionError: err.toString()
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
			<div style={{marginTop: '0.5rem'}} >
				<Button onClick={this.toggleAddPermission} text='Add permission' className='pt-button pt-small'/>

				{/* Add permission dialog */}
				<Dialog title='Add new permission to user' isOpen={this.state.showAddPermission} onClose={this.toggleAddPermission}>
					<div className='pt-dialog-body'>
						{this.state.addPermissionError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'1rem'}}>
								{this.state.addPermissionError}
							</div>
							:null}
						<FormInput id='permission' value={this.state.addPermissionText} 
							onChange={this.addPermissionChange}
							label='Permission:' disabled={this.state.addPermissionLoading}
							intent={this.state.addPermissionError?Intent.DANGER:Intent.NONE}/>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button className='pt-minimal' onClick={this.toggleAddPermission} disabled={this.state.addPermissionLoading}>Cancel</Button>
							<Button className='pt-intent-primary' onClick={this.submitAddPermission} loading={this.state.addPermissionLoading}>Add</Button>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default UserAddPermission;
