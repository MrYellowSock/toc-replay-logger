import ajv from 'ajv'

const userSchema = {
	$id: 'user', // Unique ID for the schema
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 1 },
	},
	required: ['name'],
}

const gameMapSchema = {
	$id: 'gameMap',
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 1 },
		// should we have map data?
	},
	required: ['name'],
}

const roomCreationSchema = {
	$id: 'roomCreation',
	type: 'object',
	properties: {
		users: {
			type: 'array',
			items: { $ref: 'user' }
		},
		gameMap: { $ref: 'gameMap' },
		startedAt: { type: 'string' },
		roomId: { type: 'number' },
	},
	required: ['users', 'gameMap', 'startedAt', 'roomId'],
}


const roomUpdateSchema = {
	$id: 'roomUpdate',
	type: 'object',
	properties: {
		roomId: { type: 'number' },
		progress: {},
	},
	required: ['roomId'],
}

const roomReadSchema = {
	type: 'object',
	anyOf: [
		{
			properties: {
				roomId: { type: 'number' },
			},
			required: ['roomId'],
		},
		{
			properties: {
				limit: { type: 'number' },
				offset: { type: 'number' },
			},
		}
	],
}

const ajvInstance = new ajv();
ajvInstance.addSchema(userSchema);
ajvInstance.addSchema(gameMapSchema);
ajvInstance.addSchema(roomCreationSchema);
ajvInstance.addSchema(roomUpdateSchema);
ajvInstance.addSchema(roomReadSchema);
export const validateRoomCreation = ajvInstance.compile(roomCreationSchema);
export const validateRoomUpdate = ajvInstance.compile(roomUpdateSchema);
export const validateRoomRead = ajvInstance.compile(roomReadSchema);
