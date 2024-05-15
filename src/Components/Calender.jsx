import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TaskListServices from "../Services/TaskList";

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState({});

  const onChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const taskServices = new TaskListServices();

  useEffect(() => {
    taskServices
      .getTask("")
      .then((response) => {
        if (response.status === 200) {
          // Gruplanmış görevleri oluştur
          const groupedTasks = {};
          console.log(groupedTasks);
          response.data.forEach((task) => {
            const taskDate = task.date;
            if (!groupedTasks[taskDate]) {
              groupedTasks[taskDate] = [];
            }
            groupedTasks[taskDate].push(task);
          });
          setTasks(groupedTasks);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const addTask = () => {
    if (task === "") {
      return;
    }
    const taskDate = date.toLocaleDateString();

    taskServices
      .AddTask({"content": task, "date": taskDate}, "")
      .then((response) => {
        const newTask = {"content": task, "id": response.data.id};
        console.log(response.data.id)
        const newTasks = { ...tasks };
        if (!newTasks[taskDate]) {
          newTasks[taskDate] = [];
        }
        newTasks[taskDate].push(newTask);
        setTasks(newTasks);
        setTask("");
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });   
  };

  const removeTask = (taskId) => {
    const taskDate = date.toLocaleDateString();
    const newTasks = { ...tasks };
    console.log(taskId)
    taskServices.delTask(taskId,"")
      .then((response=>{
        if(response.status===200){
          newTasks[taskDate] = newTasks[taskDate].filter(task => task.task_id !== taskId);
          setTasks(newTasks); // Silme başarılı olduğunda state'i güncelle
        }
      }))
      .catch((error) => {
        console.error("Error deleting task:", error);
        // Hata durumunda gerekli işlemleri yapabilirsiniz, örneğin kullanıcıya bir bildirim göstermek
      });
  };
  

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Günlük Görev Takibi
        </h1>
        <div className="flex justify-center mb-6">
          <Calendar
            onChange={onChange}
            value={date}
            className="w-80 h-80 border border-gray-300 rounded-lg shadow-md"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Görevi girin"
            value={task}
            onChange={handleTaskChange}
            className="flex-1 appearance-none border border-gray-300 rounded py-2 px-4 mr-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addTask}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Görev Ekle
          </button>
        </div>
        <div className="mb-6 w-80">
          <h2 className="text-xl font-bold mb-2">Görevler</h2>
          <p className="mb-2">Seçili tarih: {date.toLocaleDateString()}</p>
          {tasks[date.toLocaleDateString()] ? (
            <ul className="h-16 scroll-y-auto">
              {tasks[date.toLocaleDateString()].map((task) => (
                <li
                  key={task.id}
                  className="border-b border-gray-300 py-2 flex justify-between items-center"
                >
                  <span>{task.content}</span>
                  <button
                    onClick={() => removeTask(task.task_id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="h-16 text-gray-500">Görev yok</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCalendar;
