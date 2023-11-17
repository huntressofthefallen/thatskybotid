/**
 * Handles an error by logging it to the console in a more informative way.
 * @param {Error} err The error to be handled
 */
const handleError = async (err) => {
	const { message, name, stack } = err;
	const timestamp = new Date().toISOString();
	const errorMessage = `[${timestamp}] Error: ${name}\nMessage: ${message}\nStack Trace:\n${stack}`;
	console.error(errorMessage);
};

module.exports = handleError;