//this is error handing part of server it handles error of api 
//there are two ways to hadle api error
//1.using promise
//2.using async
//both of them is done using higher order function
//a function which can take function as an parameter is known as higher oreder function
//syntex : (fn)=>(parameters)=>{}
//in promise request used as  promise and resolve it  if error ocured we catch it and send it to next middelware
//it is function which has access to req,res and next 
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err));
    };
};

export { asyncHandler };
/**
 * const asyncHandler = (fn)=>async (req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code||500).json({
            success : false,
            message : error.message
        })
    }
}

 * 
 * 
 * 
 * 
 */