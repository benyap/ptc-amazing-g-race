import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLEnumType
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';


const settingType = new GraphQLObjectType({
	name: 'Setting',
	description: 'A setting key-value pair.',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		key: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The name of the setting'
		},
		public: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if this setting is available to the public'
		},
		valueType: {
			type: new GraphQLEnumType({
				name: 'ValueType',
				values: {
					integer: { value: 'integer' },
					integerList: { value: 'integerList' },
					string: { value: 'string' },
					stringList: { value: 'stringList' }
				}
			}),
			description: 'The expected type of the value(s)'
		},
		value: {
			type: GraphQLString,
			description: 'The value of the setting'
		},
		values: {
			type: new GraphQLList(GraphQLString),
			description: 'Values of the setting'
		},
		modifiableRoles: {
			type: new GraphQLList(GraphQLString),
			description: 'User roles which grant access to modify this permission (leave blank to allow all users with appropriate permissions)'
		},
		modified: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The time this setting was last modified'
		},
		modifiedBy: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The user that last modified the setting'
		}
	}
});


export default settingType;
