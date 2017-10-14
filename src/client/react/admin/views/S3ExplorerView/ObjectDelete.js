import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { _deleteObject } from '../../../../graphql/upload';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(_deleteObject('ok'), { name: 'MutationDeleteObject' })
@autobind
class ObjectDelete extends React.Component {
	static propTypes = {
		objectKey: PropTypes.string,
		closeObjectPreview: PropTypes.func.isRequired,
		refetchObjects: PropTypes.func.isRequired
	}

	state = {
		showDeleteObjectConfirm: false,
		deleteObjectLoading: false,
		deleteObjectError: null
	}

	toggleDeleteObjectConfirm() {
		this.setState((prevState) => {
			return { showDeleteObjectConfirm: !prevState.showDeleteObjectConfirm };
		});
	}

	async submitDeleteObject() {
		this.setState({ deleteObjectLoading: true, deleteObjectError: null });

		// Deconstruct object key into collection and key
		const regex = /^(uploads\/)([a-zA-Z]+)\/(.+)$/;
		const result = regex.exec(this.props.objectKey);
		
		try {
			await this.props.MutationDeleteObject({
				variables: {
					collection: result[2],
					key: result[3]
				}
			});
			await this.props.refetchObjects();
			this.setState({ deleteObjectLoading: false, showDeleteObjectConfirm: false });
			this.props.closeObjectPreview();
		}
		catch (err) {
			if (this.state.showDeleteObjectConfirm) this.setState({ deleteObjectLoading: false, deleteObjectError: err.toString() });
			else {
				this.setState({ deleteObjectLoading: false });
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
				<Button text='Delete object' className='pt-minimal pt-intent-danger' loading={this.state.deleteObjectLoading} onClick={this.toggleDeleteObjectConfirm}/>
				<Dialog title='Confirm delete object' isOpen={this.state.showDeleteObjectConfirm} onClose={this.toggleDeleteObjectConfirm}>
					<div className='pt-dialog-body object-preview-dialog'>
						{this.state.deleteObjectError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								{this.state.deleteObjectError}
							</div>
							: null }
							<div className='pt-callout pt-intent-warning pt-icon-warning-sign' style={{marginBottom:'0.5rem'}}>
								<h5>Warning</h5>
								Please ensure you <b>do not</b> delete user responses.
							</div>
							Are you sure you want to delete this object? This action is irreversible.
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Delete' intent={Intent.DANGER} loading={this.state.deleteObjectLoading} onClick={this.submitDeleteObject}/>
							<Button text='Cancel' className='pt-minimal' disabled={this.state.deleteObjectLoading} onClick={this.toggleDeleteObjectConfirm}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ObjectDelete;
