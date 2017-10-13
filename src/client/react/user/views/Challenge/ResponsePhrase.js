import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Button, Dialog } from '@blueprintjs/core';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import { addResponse } from '../../../../graphql/response';


@graphql(addResponse('ok'), { name: 'MutationAddResponse' })
@autobind
class ResponsePhrase extends React.Component {
	static propTypes = {
		itemKey: PropTypes.string.isRequired,
		challengeKey: PropTypes.string.isRequired,
		teamName: PropTypes.string,
		onSuccess: PropTypes.func
	}

	state = {
		showWindow: false,
		phrase: '',
		uploading: false,
		uploadError: null
	}

	async uploadPhrase() {
		this.setState({ uploading: true, uploadError: null });
		const { MutationAddResponse, challengeKey, itemKey } = this.props;
		
		const variables = { 
			challengeKey: challengeKey,
			itemKey: itemKey,
			responseType: 'phrase',
			responseValue: this.state.phrase
		};

		try {
			await MutationAddResponse({variables});
			this.setState({ uploading: false, showWindow: false });
			if (this.props.onSuccess) this.props.onSuccess();
		}
		catch (err) {
			this.setState({ uploading: false, uploadError: err.toString() });
		}
	}

	toggleWindow() {
		if (!this.state.uploading) {
			this.setState((prevState) => {
				return { showWindow: !prevState.showWindow };
			});
		}
	}

	handlePhraseChange(e) {
		this.setState({phrase: e.target.value });
	}

	render() {
		return (
			<div style={{marginTop:'0.5rem'}}>
				<Button text='Enter a phrase' className='pt-fill pt-intent-primary' iconName='highlight' onClick={this.toggleWindow}/>
				<Dialog title='Enter a phrase' isOpen={this.state.showWindow} onClose={this.toggleWindow}>
					<div className='pt-dialog-body'>
						{ this.state.uploadError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								<h5>Upload error</h5>
								{this.state.uploadError}
							</div>
							:null
						}
						<FormInput id='phrase' value={this.state.phrase} onChange={this.handlePhraseChange} large disabled={this.state.uploading}/>
						<Button className='pt-fill pt-intent-primary' text='Confirm' onClick={this.uploadPhrase} 
							loading={this.state.uploading} disabled={!this.state.phrase}/>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ResponsePhrase;
