const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let countRequest = 0;

server.use((req, res, next) => {
  countRequest++;
  console.log(`Request ${countRequest}`);

  next();
});

function checkProjectId(req, res, next) {
  const id = req.params.id;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "ID doesn't exist" });
  }
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});

server.post("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);

  project.tasks.push(title);
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);
  return res.json(projects);
});

server.put("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);

  project.title = title;
  return res.json(projects);
});

server.listen(3000);
