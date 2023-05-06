
let stackVar;

const asyncHandler = (API) => {
    return (req, res, nxt) => {
        API(req, res, nxt).catch(err => {

            stackVar = err.stack
           nxt(new Error(err.message));
        })
    }
}

const globalResponse = (err,req,res,nxt)=>{
    if (err){
        if(process.env.ENV_MODE=='DEV')return res.status(err["cause"] || 500).json({
            Message: "fail response",
            Error: err.message,
            stack: stackVar,
            });
        return res.status(err["cause"] || 500).json({
            Message: "fail response",
            Error: err.message,
            });
    }
}

export { asyncHandler, globalResponse }