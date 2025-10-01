//express framework provides us Error class
//so on downRoad error handling we use that class
//we first inharit that class than create constructor
//define the properties of that code
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors


        if (stack) {
          this.stack  = stack  
        } 
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError}