const	Person = require('../models/Person');

const formatTime = () =>
{
	const now = new Date();
	const formattedTimestamp = `${now.toDateString()} ${now.toTimeString()}`;

	return (formattedTimestamp);
}

const parseRequest = async (body) =>
{
	let		error;
	const	isInDB = await Person.find({name: body.name});

	if (!body.name && !body.number)
	{
		error = 'name AND/OR number must not be empty';
	}
	else if (!body.name)
	{
		error ='name must not be empty';
	}
	else if (!body.number)
	{
		error ='number must not be empty';
	}
	else if (isInDB.length > 0)
	{
		error = 'name must be unique';
	}
	else
	{
		error = null;
	}
	return (error);

};

const getAllPersons = async (request, response) =>
{
	try
	{
		const	result = await Person.find({});

		response.json(result);
	}
	catch(error)
	{
		console.log(`Could not fetch persons: ${error}`);
	}
}

const getPersonById = async (request, response, next) =>
{
	const	id = request.params.id;
	try
	{
		const	person = await Person.findById(id);
		if (person)
		{
			response.json(person);
		}
		else
		{
			response.status(404);
			response.send(`person with id ${id} not found`);
		}
	}
	catch(error)
	{
		next(error);
	}
}

const savePerson = async (request, response) =>
{
	const	body = request.body;
	const	error = await parseRequest(body);	
	const	person = new Person(
	{
		name: body.name,
		number: body.number
	})

	if (error)
	{
		console.log('enters here');
		return (response.status(400).json({error: error}));
	}
	try
	{
		const savedNote = await person.save();
		response.json(savedNote);
	}
	catch(error)
	{
		console.log(`Error saving note: ${error}`);
	}
}

const deletePerson = async(request, response, next) =>
{
	const	id = request.params.id;
	
	try
	{
		await Person.findByIdAndDelete(id)
		response.status(204).end();
	}
	catch(error)
	{
		next(error);
	}
}

const updatePerson = async(request, response, next) =>
{
	const	id = request.params.id;
	const	body = request.body;
	const	person = 
	{
		name: body.name,
		number: body.number
	}
	
	try
	{
		const updatedPerson = await Person.findByIdAndUpdate(id, person, {new: true});
		
		response.json(updatedPerson);
	}
	catch(error)
	{
		next(error);
	}
}

const getInfo = async (request, response) =>
{
	let	result;
	try
	{
		result = await Person.find({});
	}
	catch(error)
	{
		console.log(`Could not fetch persons: ${error}`);
		response.status(500).end()
	}
	const	message = `Phonebook has info for ${result.length} people`
	const	date = formatTime();

	response.send(`<p>${message}</p><p>${date}</p>`);
}

module.exports = { getAllPersons, getPersonById, savePerson, getInfo, deletePerson, updatePerson };