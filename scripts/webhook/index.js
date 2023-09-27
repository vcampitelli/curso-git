const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json

const EVENTS = {};

app.get('/', function(req, res) {
  res.header('Content-type', 'application/json');
  res.send(
      JSON.stringify(EVENTS, null, 2)
  );
});

app.post('/gitlab', function(req, res) {
  if ((!req.body.project) ||
      (!req.body.project.name) ||
      (!req.body.object_kind) ||
      (!['push', 'merge_request'].includes(req.body.object_kind))) {
    res.status(400).send();
    return;
  }

  if (!EVENTS[req.body.project.name]) {
    EVENTS[req.body.project.name] = [];
  }
  EVENTS[req.body.project.name].push(req.body);
  res.send({
    status: true,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
