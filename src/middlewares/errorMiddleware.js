
module.exports = function errorMiddleware(err, req) {
  console.log(req.url);
  console.log(`${err.status} ${err.name} : ${err.message}`);
  console.log(err.stack);
};
