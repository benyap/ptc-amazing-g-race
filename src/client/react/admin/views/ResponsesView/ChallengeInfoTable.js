import React from 'react'
import PropTypes from 'prop-types';
import { EditableText } from '@blueprintjs/core';


class ChallengeInfoTable extends React.Component {
	static propTypes = {
		response: PropTypes.shape({
			challengeKey: PropTypes.string.isRequired,
			itemKey: PropTypes.string.isRequired
		}).isRequired,
		challenge: PropTypes.shape({
			notes: PropTypes.string
		})
	}

	render() {
		const { response, challenge } = this.props;

		return (
			<div style={{marginBottom:'1rem',width:'100%'}}>
				<h6><b>Challenge data</b></h6>
				<table className='pt-table pt-striped' style={{width:'100%'}}>
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
							<td>Challenge notes</td>
							<td>
								{
									challenge ? 
									<EditableText multiline maxLines={6} disabled value={challenge.notes} placeholder='No notes'/>:
									<div className='pt-text-muted'>Loading...</div>
								}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default ChallengeInfoTable;
