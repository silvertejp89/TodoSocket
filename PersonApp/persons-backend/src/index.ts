import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Person } from "./models/Person";
import { Todo } from "./models/Todo";

const persons: Person[] = [];
const todos: Todo[] = [];

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("A user has connected");

  socket.on("add_user", (newUser: Person) => {
    persons.push(newUser);
    console.log(persons);
    io.emit("persons_updated", persons);
  });

  socket.on("add_todo", (newTodo: Todo) => {
    todos.push(newTodo);
    io.emit("todos_updated", todos);
  });
});

server.listen(3000, () => {
  console.log("Server is up and running");
});
