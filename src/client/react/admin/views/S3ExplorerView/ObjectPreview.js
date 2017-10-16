import React from 'react';
import PropTypes from 'prop-types';
import DateFormat from 'dateformat';
import autobind from 'core-decorators/es/autobind';
import { graphql, withApollo } from 'react-apollo';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import { _getObject } from '../../../../graphql/upload';
import { getProtectedSetting } from '../../../../graphql/setting';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ImageContainer from '../../components/ImageContainer';
import ObjectDelete from './ObjectDelete';


const QueryS3ObjectsParams = 'Name Prefix KeyCount Contents{Key LastModified Size} CommonPrefixes{Prefix}';

const QueryS3BucketUrlOptions = {
	name: 'QueryS3BucketUrl',
	options: {
		variables: { key: 'aws_bucket_url' }
	}
}

@graphql(getProtectedSetting('key value'), QueryS3BucketUrlOptions)
@withApollo
@autobind
class ObjectPreview extends React.Component {
	static propTypes = {
		objectKey: PropTypes.string,
		refetchObjects: PropTypes.func.isRequired,
		close: PropTypes.func.isRequired
	}

	state = {
		loading: false,
		getObjectError: null,
		getObjectData: null
	}

	async componentWillReceiveProps(nextProps) {
		// Don't do anything if data has already loaded
		if (this.state.getObjectData || this.state.getObjectError) return;

		this.setState({ getObjectError: null, getObjectData: null });

		if (nextProps.objectKey) {
			this.setState({ loading: true });
			try {
				const result = await this.props.client.query({
					query: _getObject('data date'),
					variables: { key: nextProps.objectKey },
					fetchPolicy: 'network-only'
				});

				this.setState({ loading: false, getObjectData: result.data._getObject });
			}
			catch (err) {
				this.setState({ loading: false, getObjectError: err.toString() });
			}
		}
	}

	close() {
		this.setState({ loading: false, getObjectData: false, getObjectError: null });
		this.props.close();
	}

	render() {
		let content, markup, date;

		if (this.state.loading) {
			content = <LoadingSpinner/>;
		}
		else if (this.state.getObjectData) {
			content = <ImageContainer src={this.state.getObjectData.data} alt={this.props.objectKey} imgStyle={{maxWidth:'100%',maxHeight:'50vh'}}/>;
			date = `Retrieved from the server at ${DateFormat(new Date(this.state.getObjectData.date), 'hh:MM:ss TT (mmm dd yyyy)')}`;
		}

		const { loading, getProtectedSetting: url } = this.props.QueryS3BucketUrl;

		if (url) {
			markup = (
				<div className='pt-callout pt-intent-primary pt-icon-share'>
					Copy the text below to use this image in Markdown. 
					Please note that the link will only work if this is a <b>public asset</b>.
					<FormInput id='url' readOnly value={`![](${url.value}/${this.props.objectKey})`} helperText={date}/>
				</div>
			);
		}
		else if (loading) {
			markup = (
				<div className='pt-callout pt-intent-primary pt-icon-share'>
					Copy the text below to use this image in Markdown. 
					Please note that this will only work if it is a <b>public asset</b>.
					<FormInput id='url' readOnly disabled value='Loading...'/>
				</div>
			);
		}
		else {
			markup = (
				<div className='pt-callout pt-intent-danger pt-icon-error'>
					Unable to retrieve asset link.
				</div>
			);
		}

		return (
			<div>
				<Dialog isOpen={this.props.objectKey} title='Upload preview' onClose={this.close}>
					<div className='pt-dialog-body object-preview-dialog'>
						{this.state.getObjectError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								{this.state.getObjectError}
							</div>
							: null }
						{content}
						{markup}
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<ObjectDelete objectKey={this.props.objectKey} closeObjectPreview={this.close} refetchObjects={this.props.refetchObjects}/>
							<Button text='Close' intent={Intent.PRIMARY} loading={this.props.deleteLoading} onClick={this.close}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ObjectPreview;
