const initialState = {
	access: null,
	refresh: null,
	refreshCount: 0,
	lastRefresh: null
};

export default function reducer(state = initialState, { type, payload }) {
	switch(type) {

		case 'AUTH_LOGIN': {
			return { ...state,
				access: payload.access,
				refresh: payload.refresh,
				refreshCount: 0,
				lastRefresh: null
			}
		}

		case 'AUTH_REFRESH': {
			if (!state.refresh) {
				// No refresh token exists in state,
				// do not allow refresh
				return state;
			}
			else return { ...state,
				access: payload.access,
				refreshCount: state.refreshCount + 1,
				lastRefresh: payload.time
			}
		}

		case 'AUTH_LOGOUT': {
			if (!state.access) {
				// No access token exists,
				// do not allow logout
				return state;
			}
			else return { ...state,
				access: null,
				refresh: null,
				refreshCount: 0,
				lastRefresh: null
			}
		}

		default: {
			return state;
		}
	}
};
