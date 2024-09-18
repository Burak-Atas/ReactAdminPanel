import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { Chart, ArcElement } from "chart.js";
import KnowledgeServices from "../Services/KnowledgeServices";
import TaskListServices from "../Services/TaskList";

Chart.register(ArcElement);

const data = {
  labels: ["Aktif", "Pasif"],
  datasets: [
    {
      data: [96, 4],
      backgroundColor: ["#5052ff", "#ccc"],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};




function Dashboard() {
  const [knowledge, setKnowledge] = useState([]);
  const [task, setTask] = useState([]);
  const [newKnowledge, setNewKnowledge] = useState(""); // 1. State Tanımlaması

  const kns = new KnowledgeServices();
  const taskSevices = new TaskListServices();


  const fetchData = async () => {
    const token = localStorage.getItem("token")
    try {
      const knowledgeResponse = await kns.GetKnowledge(token);
      console.log("knowl",knowledgeResponse)
      if (Array.isArray(knowledgeResponse.data)) {
        setKnowledge(knowledgeResponse.data);
      } else {
        console.error("Expected an array but got:", knowledgeResponse.data);
      }
  
      const taskResponse = await taskSevices.getTask("");
      setTask(taskResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []); // Bu useEffect sadece bileşen ilk yüklendiğinde çalışır
  
  



  const handlePublish = async (id) => {
    try {
      await kns.SetPublishKnowledge({ id: id });
      fetchData(); // Veriyi tekrar al
    } catch (error) {
      console.error("Error publishing knowledge:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await kns.Deleteknowledge(id);
      fetchData(); // Veriyi tekrar al
    } catch (error) {
      console.error("Error deleting knowledge:", error);
    }
  };
  
  const handleNotPublish = async (id) => {
    try {
      await kns.SetNotPublishKnowledge({ id: id });
      fetchData(); // Veriyi tekrar al
    } catch (error) {
      console.error("Error removing from publish:", error);
    }
  };
  
  const handleAddknowledge = async () => {
    if (newKnowledge.trim()) {
      try {
        await kns.Addknowledge({ content: newKnowledge });
        setNewKnowledge("");
        fetchData(); // Veriyi tekrar al
      } catch (error) {
        console.error("Error adding knowledge:", error);
      }
    } else {
      console.error("Bilgi içeriği boş olamaz");
    }
  };
  

  return (
    <div className="w-full h-full">
      {/* Başlık */}
      <div className="text-3xl font-semibold py-4">GENEL DURUM</div>

      {/* İçerik Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sol Panel */}
        <div className="bg-white h-4/5 flex justify-center rounded-lg shadow p-4">
          <div className="h-[400px]">
            <Pie data={data} options={options} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Yaklaşan Görevler */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="flex justify-center text-sky-500 text-lg font-medium mb-4">
              Yaklaşan Görevler
            </h3>
            <div>
              {task.length === 0 ? (
                <p className="text-rose-500">Yaklaşan görev yok</p>
              ) : (
                <ul>
                  {task.map((value, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <span className="text-gray-500">{value.date}</span>
                      <span className="ml-4">{value.content}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Link
              to="/calendar"
              className="mt-4 flex justify-center bg-sky-500 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-600"
            >
              Bildiri Ekle
            </Link>
          </div>

          {/* Faydalı Bilgiler */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="flex justify-center text-sky-500 text-lg font-medium mb-4">
              Faydalı Bilgiler
            </h3>
            <div className="flex">
              <div className="flex flex-col space-y-2">
                {knowledge.length === 0 ? (
                  <p className="text-rose-500">Faydalı bilgi yok</p>
                ) : (
                  knowledge.map((value, index) => (
                    <div key={index} className="flex items-center">
                      <span className="flex-1">{value.content}</span>
                      <div className="flex flex-col mx-5">
                        {!value.publish ? (
                          <div className="flex">
                          <button
                            className="bg-sky-500 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-600"
                            onClick={() => handlePublish(value.id)}
                          >
                            Yayınla
                          </button>
                          <button
                            className="bg-red-500 mx-3 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                            onClick={() => handleDelete(value.id)}
                          >
                            sil
                          </button></div>
                        ) : (
                          <button
                            className="bg-sky-200 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-600"
                            onClick={() => handleNotPublish(value.id)}
                          >
                            Yayından kaldır
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Faydalı Bilgi Ekle */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="flex justify-center text-sky-500 text-lg font-medium mb-4">
              Faydalı Bilgi Ekle
            </h3>
            <div className="flex">
              <input
                type="text"
                value={newKnowledge} // 2. Input Değeri Güncelleme
                onChange={(e) => setNewKnowledge(e.target.value)}
                className="w-full h-8 border"
              />
            </div>
            <div className="text-center mt-3">
              <button
                className="bg-sky-500 text-white px-8 py-2 rounded-lg shadow hover:bg-sky-600"
                onClick={() => handleAddknowledge()}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
