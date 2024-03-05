import { Socket, io } from "socket.io-client";
import "./App.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AddUser } from "./components/AddUser";
import { Person } from "./models/Person";
import { Todo } from "./models/Todo";

function App() {
  // fetch("http://localhost:3000").then((response: Response) => {
  //   response.json().then((data) => {
  //     console.log(data);
  //   });
  // });

  const [socket, setSocket] = useState<Socket>();
  const [persons, setPersons] = useState<Person[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<Todo>({
    id: 0,
    title: "",
    isDone: false,
  });

  useEffect(() => {
    const s = io("http://localhost:3000");

    s.on("persons_updated", (persons: Person[]) => {
      setPersons(persons);
    });

    s.on("todos_updated", (todos: Todo[]) => {
      setTodos(todos);
    });

    setSocket(s);

    return () => {
      socket?.disconnect();
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo({
      ...todo,
      title: e.target.value,
      id: Date.now(),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket?.emit("add_todo", todo);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={todo.title}
          onChange={handleChange}
        />
        <button>Spara</button>
      </form>
      <AddUser socket={socket} />
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
