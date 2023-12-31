const	mongoose = require('mongoose');
let		password;
let		url;

if (process.argv.length < 3)
{
	console.log('give password as argument!');
	process.exit(1);
}

password = process.argv[2];
url = `mongodb+srv://testdb:${password}@cluster0.nyibhgs.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const	personSchema = new mongoose.Schema(
{
	name: String,
	number: Number,
})

const	Person = mongoose.model('Person', personSchema);

const	savePerson = async () =>
{
	const	person = new Person(
	{
		name: process.argv[3],
		number: process.argv[4]
	}
	)
	
	try
	{
		const	result = await person.save();
		console.log('note saved!');
		mongoose.connection.close();
	}
	catch(error)
	{
		console.log(`Error saving note: ${error}`);
	}
}

const	getAllPersons = async () =>
{
	try
	{
		const result = await Person.find({});

		result.forEach(person => 
		{
			console.log(person);
		});
		mongoose.connection.close();
	}
	catch (error)
	{
		console.log(`Could not fetch records: ${error}`);
	}
}

if (process.argv.length === 3)
{
	getAllPersons();
}

if (process.argv.length === 5)
{
	savePerson();
}