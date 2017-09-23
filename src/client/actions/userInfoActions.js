/**
 * Save a user's team information when the log in.
 * @param {*} teamId
 * @param {*} teamMembers
 */
export function saveTeamInfo(teamId, teamName, teamMembers) {
	return {
		type: 'USER_SAVE_TEAM_INFO',
		payload: {
			teamId,
			teamName,
			teamMembers
		}
	}
}
