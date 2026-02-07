module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;


    if(process.env.NODE_ENV == 'development'){ 

   return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
        error: err
        

        })
    }

    if(process.env.NODE_ENV == 'production'){
        let message = err.message;
        let error = new Error(message);

        if(err.name === "ValidationError"){
            message = Object.values(err.errors).map(value => value.message)
            .join(', ');
            error = new Error(message)
            err.statusCode = 400;
        }

        if(err.name === "CastError"){
            message = `Resource not found: ${err.path}`;
            error = new Error(message);
            err.statusCode = 400;
        }

        if(err.code === 11000){
            let message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new Error(message);
        }

        if(err.name === "JsonWebTokenError"){
           let message = `JSON Web Token is invalid, try again`;
            error = new Error(message);
            err.statusCode = 400;
        }

        if(err.name === "TokenExpiredError"){
           let message = `JSON Web Token is Expired, try again`;
            error = new Error(message);
            err.statusCode = 400;
        }

    return res.status(err.statusCode).json({
        success: false,
        message: error.message ||'Internal Server Error' ,
        })
    }
}

