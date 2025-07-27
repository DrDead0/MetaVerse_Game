import express from 'express';
const app = express();
app.use("api/v1"); //this is prefix router and can be used in many ways and many times
//instead of using app.get or app.post number of times





app.listen(3000, () => {
  console.log('HTTP server is running on port 3000');
});