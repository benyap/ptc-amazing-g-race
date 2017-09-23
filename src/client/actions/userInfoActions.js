/**
 * Save a user's team information when the log in.
 * @param {*} teamId
 * @param {*} teamMembers
 */
export function setTeamInfo(teamId, teamName, teamMembers) {
	return {
		type: 'USER_SET_TEAM_INFO',
		payload: {
			teamId,
			teamName,
			teamMembers
		}
	}
}
