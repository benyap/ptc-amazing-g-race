const initialState = {
	teamId: null,
	teamMembers: null
};

export default function reducer(state = initialState, { type, payload }) {
	switch(type) {

		case 'USER_SAVE_TEAM_INFO': {
			return { ...state,
				teamId: payload.teamId,
				teamMembers: payload.teamMembers
			}
		}

		default: {
			return state;
		}
	}
};
