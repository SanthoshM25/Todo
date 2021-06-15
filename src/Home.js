import { useEffect, useState } from "react";
import firebase from "firebase";
import db from "./firebase";

const Home = () => {
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState("");
  const input = document.getElementById("task-inp");

  const addTodo = (e) => {
    e.preventDefault();
    task &&
      db.collection("tasks").add({
        task: task,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setTask("");
  };

  useEffect(() => {
    db.collection("tasks")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setTaskList(
          snapshot.docs.map((doc) => ({ id: doc.id, task: doc.data().task }))
        );
      });
  }, []);

  return (
    <div className="container">
      <h1 className="title">TODOista</h1>
      <div className="todo-inp">
        <form>
          <input
            type="text"
            id="task-inp"
            placeholder=" Add Tasks here"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
            }}
          />
          <button disabled={!task} type="submit" id="btn-add" onClick={addTodo}>
            +
          </button>
        </form>
      </div>
      <div className="task-list">
        <ul className="list">
          {taskList &&
            taskList.map((task) => {
              return (
                <li
                  onClick={(e) => {
                    if (e.target.classList.contains("done")) {
                      e.target.classList.remove("done");
                    } else {
                      e.target.classList.add("done");
                      setTimeout(() => {
                        db.collection("tasks").doc(task.id).delete();
                        e.target.classList.remove("done");
                      }, 500);
                    }
                  }}
                >
                  {task.task}
                  <button
                    onClick={() => {
                      db.collection("tasks").doc(task.id).delete();
                    }}
                    className="del-btn"
                  ></button>
                  <button
                    onClick={() => {
                      setTask(task.task);
                      db.collection("tasks").doc(task.id).delete();
                      input.focus();
                    }}
                    className="edit-btn"
                  ></button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
