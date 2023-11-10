require('dotenv').config();
const	mongoose = require('mongoose');
const	url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

const	connectDB = async () =>
{
	try 
	{
		await mongoose.connect(url);
		console.log('connected to MongoDB');
	} 
	catch (error) 
	{
		console.log(`Error connecting to MongoDB: ${error}`);
		process.exit(1);
	}
}

const	closeDB = () =>
{
	mongoose.connection.close();
}

module.exports = { connectDB, closeDB };