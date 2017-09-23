const initialState = {
	teamId: null,
	teamName: null,
	teamMembers: null
};

export default function reducer(state = initialState, { type, payload }) {
	switch(type) {

		case 'USER_SET_TEAM_INFO': {
			return { ...state,
				teamId: payload.teamId,
				teamName: payload.teamName,
				teamMembers: payload.teamMembers
			}
		}

		default: {
			return state;
		}
	}
};
