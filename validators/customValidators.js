const	phoneNumberValidator = (value) =>
{
	return (/^\d{2,3}-\d{6,}$/.test(value));
}

module.exports = { phoneNumberValidator };