const	mongoose = require('mongoose');
const	validators = require('../validators/customValidators');

const	personSchema = new mongoose.Schema(
{
	name: 
	{
		type: String,
		minLength: 3,
		required: true
	},
	number: 
	{
		type: String,
		required: true,
		validate:
		{
			validator: validators.phoneNumberValidator,
			message: 'Please enter a valid phone number (e.g., 09-123456, 058-123456)'
		}
	}
})

personSchema.set('toJSON', 
{
	transform: (document, returnedObject) =>
	{
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})
	
module.exports = mongoose.model('Person', personSchema);

