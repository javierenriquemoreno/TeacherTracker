const { PreMiddlewareFunction, Query, Schema, model } = require('mongoose');

const coursesSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	section: {
		type: Number,
		required: true
	},
	time: {
		type: Object,
		required: true
	},
	days: {
		type: [ String ],
		required: true
	},
	teacher: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	students: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Users'
			}
		],
		default: []
	},
	code: {
		type: String,
		required: true
	},
	statuses: {
		type: [ Object ],
		default: []
	}
}, {
	timestamps: true
});

// /** @type { PreMiddlewareFunction<Query<any, any, {}, any, "find">> } */
// function autoPopulate(next) {
// 	this.populate({
// 		path: "teacher students",
// 		select: "-email -password -createdAt -updatedAt -__v -type"
// 	});

// 	next();
// };

// coursesSchema.pre('find', autoPopulate);
// coursesSchema.pre('findOne', autoPopulate);

module.exports = model('Courses', coursesSchema);