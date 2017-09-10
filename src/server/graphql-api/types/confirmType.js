import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLString,
	GraphQLID	
} from 'graphql';

import actionType from './actionType';


const confirmType = new GraphQLObjectType({
	name: 'Confirm',
	description: 'Confirm whether an action was successful',
	fields: {
		ok: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the action was successful'
		},
		action: {
			type: actionType,
			description: 'A log of the action that was executed (some actions do not provide an action log)'
		},
		failureMessage: {
			type: GraphQLString,
			description: 'A description of the failure if the action failed'
		}
	}
});


export default confirmType;
