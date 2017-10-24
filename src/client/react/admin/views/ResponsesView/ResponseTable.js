import React from 'react'
import PropTypes from 'prop-types';
import DateFormat from 'dateformat';
import { EditableText } from '@blueprintjs/core';


class ResponseTable extends React.Component {
	static propTypes = {
		response: PropTypes.shape({
			challengeKey: PropTypes.string.isRequired,
			itemKey: PropTypes.string.isRequired,
			uploadedBy: PropTypes.string.isRequired,
			checked: PropTypes.bool.isRequired,
			checkedBy: PropTypes.string,
			checkedOn: PropTypes.string,
			responseValid: PropTypes.bool.isRequired,
			retry: PropTypes.bool.isRequired,
			pointsAwarded: PropTypes.number.isRequired
		}).isRequired,
		challenge: PropTypes.shape({
			notes: PropTypes.string
		})
	}

	render() {
		const { response, challenge } = this.props;

		return (
			<div style={{paddingRight:'0.5rem'}}>
				<h6><b>Response data</b></h6>
				<table className='pt-table pt-striped'>
					<tbody>
						<tr>
							<td>Challenge</td>
							<td>{response.challengeKey}</td>
						</tr>
						<tr>
							<td>Item</td>
							<td>{response.itemKey}</td>
						</tr>
						<tr>
							<td>Uploader</td>
							<td>{response.uploadedBy}</td>
						</tr>
						<tr>
							<td>Challenge notes</td>
							<td>
								{
									challenge ? 
									<EditableText multiline maxLines={6} disabled value={challenge.notes} placeholder='No notes'/>:
									<div className='pt-text-muted'>Loading...</div>
								}
							</td>
						</tr>
						<tr>
							<td>Status</td>
							<td>
								{
									response.checked ?
									<span style={{color:'green'}}>Checked by {response.checkedBy}<br/>{DateFormat(new Date(response.checkedOn), 'hh:MM:ss TT mmm dd yyyy')}</span> :
									<span style={{color:'red'}}><b>Not checked</b></span>
								}
							</td>
						</tr>
						<tr>
							<td>Response valid</td>
							<td>
								{
									response.responseValid ?
									<span style={{color:'green'}}>Valid</span> :
									<span style={{color:'darkred'}}>Invalid</span>
								}
							</td>
						</tr>
						<tr>
							<td>Retry</td>
							<td>
								{
									response.retry ?
									<span style={{color:'green'}}>Can retry</span> :
									<span style={{color:'darkred'}}>Cannot retry</span>
								}
							</td>
						</tr>
						<tr>
							<td>Points awarded</td>
							<td>{response.pointsAwarded}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default ResponseTable;
