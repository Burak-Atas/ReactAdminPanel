import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2"; // Pie bileşeni ekleniyor
import { Chart, registerables } from "chart.js";
import { options } from "../BarChart/BarChartOptions"; // Bar grafiği için özel seçenekler
import TaskListServices from "../Services/TaskList";
import { Link } from "react-router-dom";
import UserServices from "../Services/UserServices";

Chart.register(...registerables);

const campUsers = [10, 20, 15];
const camps = ["kamp1", "kamp2", "kamp3"];
const labels = camps; // Pasta grafiği için etiketler kamp adları olacak

// Grafik verileri pasta grafiği için düzenleniyor
const data = {
  labels,
  datasets: [
    {
      backgroundColor: ["#5052ff", "#4facfe", "#58a6ff"], // Renkler
      data: campUsers,
    },
  ],
};

const taskServices = new TaskListServices();
const userServices = new UserServices();

const Dashboard = () => {
  const [task, setTask] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    taskServices
      .getTask()
      .then((response) => {
        console.log(response.data);
        setTask(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  useEffect(() => {
    userServices
      .getUser()
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.slice(0, 5)); // Corrected slice method
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const graphStyle = {
    minHeight: "20rem", // Örnek olarak 20rem olarak ayarladım, ihtiyaca göre değiştirebilirsin
    maxWidth: "540px",
    width: "100%",
    borderRadius: "0.375rem",
    padding: "30px",
  };

  return (
    <div className="w-full h-full">
      <div className="h-32 flex items-center">
        <h2 className="text-6xl">DASHBOARD</h2>
      </div>
      <div className="flex justify-between">
        <div className="w-4/6" style={graphStyle}>
          <Pie data={data} options={options} /> {/* Pasta grafiği */}
        </div>
        <div className="flex w-full h-full justify-between flex-col">
          <div className="flex w-full h-60 justify-between">
            <div className="w-2/6  flex justify-between items-center h-full flex-col capitalize text-xl">
              <p className=" bg-gray-200 w-full h-8 text-center rounded-xl text-sky-500">Aktif öğrenci sayısı</p>
              <p className="text-7xl"> 96</p>
              <Link
                to="/profil"
                className="w-40 h-8 text-base bg-5052ff rounded-xl shadow-lg text-sky-500 flex items-center justify-center"
              >
                Tüm bilgileri gör
              </Link>
            </div>
            <div className="w-3/6 h-full flex flex-col justify-between items-center ">
              <h3 className="bg-5052ff bg-gray-200 w-full text-xl  rounded-xl text-sky-500 h-8 flex justify-center items-center">
                Yaklaşan Görevler
              </h3>
              <div className="">
                {task.length === 0 ? (
                  <div className="text-5052ff mt-4 text-center ">
                    {" "}
                    <p className="text-rose-500">Yaklaşan görev yok</p>
                  </div>
                ) : (
                  task.map((value, index) => {
                    return (
                      <div key={index} className="w-full mt-2 flex">
                        <p className="">{value.date}</p>
                        <p className="ml-4">{value.content}</p>
                      </div>
                    );
                  })
                )}
              </div>
              <Link
                to="/calendar"
                className="w-32 h-8  bg-5052ff rounded-xl shadow-lg flex items-center justify-center text-sky-500"
              >
                Bildiri Ekle
              </Link>
            </div>
          </div>
          <div className="mt-12  flex items-center">
            <div className="w-1/2">
              <div className='flex w-full bg-gray-200 h-8 p-2 font-bold rounded-xl'>
                    <div className='w-4/6 text-sky-500'>Kullanıcı Adı</div>
                    <div className='w-2/6 text-sky-500'>Puan</div>
                </div>
              {user.length === 0 ? (
                <div className="text-5052ff mt-4 h-8  text-center ">
                  {" "}
                  <p className="text-rose-500">Kayıtlı Kullanıcı yok</p>
                </div>
              ) : (
                user.map((value, index) => {
                  return (
                    <div key={index} className="mt-2  mx-1 flex">
                      <p className="w-4/6">{value.name}</p>
                      <p className="w-2/6">{value.tamamlanan_gun}</p>
                    </div>
                  );
                })
              )}
              <Link
                to="/profil"
                className="w-40 mt-5 ml-20 h-8 text-base bg-5052ff rounded-xl shadow-lg text-sky-500 flex items-center justify-center"
              >
                Kullanıcılar
              </Link>
            </div>
            <div className="w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
