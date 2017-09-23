/**
 * Save a user's team information when the log in.
 * @param {*} teamId
 * @param {*} teamMembers
 */
export function saveTeamInfo(teamId, teamMembers) {
	return {
		type: 'USER_SAVE_TEAM_INFO',
		payload: {
			teamId,
			teamMembers
		}
	}
}
