function errorHandlerMiddleware(err, req, res) {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';
    res.status(statusCode).json({error: errorMessage});
}

module.exports = errorHandlerMiddleware;
