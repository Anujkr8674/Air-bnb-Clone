// use for custom wrapAsync


// function wrapAsync(fn) {}
module.exports = (fn) => {
    return(req, res, next) => {
        fn(req, res, next).catch(next);
    };
};