import express from 'express';

import auth from './basic-auth.model';

const PORT = 3040;

// Make express app
const app = express();

// Authenticate the request - selfInit is set to true in the model so init() is omitted
app.use(auth.authenticate());

// some endpoint
app.get('/get-some-info', (req, res) => res.json({ result: req.user.someInfo }));

// some endpoint
app.get('/get-other-info', (req, res) => res.json({ result: req.user.otherInfo }));

// send error for unknown requests
app.use('*', (req, res) => res.json({ error: 'unknown request' }));

// listen for requests on port 3001 always use https in production
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
