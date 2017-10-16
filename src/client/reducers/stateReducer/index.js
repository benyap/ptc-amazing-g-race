const initialState = {
	loaded: false,
	challengeLoadWasSuccessful: false
};

export default function reducer(state = initialState, { type, payload }) {
	switch(type) {

		case 'REDUX_STORAGE_LOAD': {
			return { ...state,
				loaded: true
			}
		}

		case 'CHALLENGE_LOAD_WAS_SUCCESSFUL': {
			return { ...state,
				challengeLoadWasSuccessful: payload.successful
			}
		}

		// Reset challenge load state on logout
		case 'AUTH_LOGOUT': {
			return { ...state,
				challengeLoadWasSuccessful: false
			}
		}
		
		default: {
			return state;
		}
	}
};
