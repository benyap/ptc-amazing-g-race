import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { graphql } from 'react-apollo';
import { Button, Dialog } from '@blueprintjs/core';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import { getResponseData } from '../../../../graphql/response';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ImageContainer from '../../components/ImageContainer';


const imgContainerStyle = {
	textAlign: 'center',
	background: 'rgba(0, 0, 0, 0.8)',
	color: 'white',
	padding: '0.5rem',
	borderRadius: '0.3rem',
	marginBottom: '0.5rem'
}

const QueryGetResponseDataOptions = {
	name: 'QueryGetResponseData',
	options: (props) => {
		return { 
			fetchPolicy: 'cache-and-network',
			variables: { responseId: props.response._id } 
		}
	}
}

@graphql(getResponseData('data date'), QueryGetResponseDataOptions)
@autobind
class ResponsePreview extends React.Component {
	static propTypes = {
		response: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			uploadedBy: PropTypes.string.isRequired,
			challengeKey: PropTypes.string.isRequired,
			itemKey: PropTypes.string.isRequired,
			responseType: PropTypes.oneOf(['upload', 'phrase']).isRequired
		}).isRequired
	}

	state = {
		showResponseData: false
	}

	toggleShowResponseData() {
		this.setState((prevState) => {
			return { showResponseData: !prevState.showResponseData };
		});
	}

	render() {
		const { getResponseData, loading } = this.props.QueryGetResponseData;
		const { uploadedBy, challengeKey, itemKey, responseType } = this.props.response;
		let responseData;

		if (getResponseData) {
			const date = (
				<div className='pt-callout' style={{marginBottom:'0.5rem'}}>
					{`Retrieved from server at ${DateFormat(new Date(getResponseData.date), 'hh:MM TT mmm dd yyyy')}`}
				</div>
			);

			if (responseType === 'upload') {

				responseData = (
					<div>
						{date}
						<ImageContainer src={getResponseData.data} alt={`Response uploaded by ${uploadedBy}`}/>
					</div>
				);
			}
			else if (responseType === 'phrase') {
				responseData = (
					<div>
						{date}
						<FormInput id='phrase' readOnly large value={getResponseData.data}/>
					</div>
				);
			}
		}
		else if (loading) {
			responseData =  <LoadingSpinner/>;
		}

		return (
			<div>
				<Button className='pt-fill pt-minimal pt-intent-primary' iconName='upload' text='See response' onClick={this.toggleShowResponseData}/>
				<Dialog title={`[${uploadedBy}] ${challengeKey}: ${itemKey}`} isOpen={this.state.showResponseData} 
					onClose={this.toggleShowResponseData} style={{maxWidth:'100%'}}>
					<div className='pt-dialog-body'>
						{responseData}
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ResponsePreview;
