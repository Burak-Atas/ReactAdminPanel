import React, { useEffect, useState } from "react";
import Calendar from "../Components/Calender";
import ProfileServices from "../Services/ProfileSercices";

export default function Profile() {
  const [counterCamp, setCounterCamp] = useState(5);
  const [counterTeach, setCounterTeach] = useState(1);
  const [counterExercise, setCounterExercise] = useState(40);
  const [counterActiveUSer, setCounterActiveUser] = useState(40);

  const pr = new ProfileServices();

  useEffect(() => {
    pr.getprofile("")
      .then((response) => {
        if (response.status === 200) {
        } else {
        }
      })
      .catch((error) => {
        console.error("Hata oluştu:", error);
      });
  });

  return (
    <div className="w-full h-full">
      <div className="h-40 flex justify-center flex-col">
        <h2 className="text-6xl">İRİS AKADEMİ</h2>
        <p className="mt-3 text-2xl">Yönetim Profile</p>
      </div>
      <div className="w-full flex items-center justify-between mr-16">
      <div>
        <p className="my-3 text-2xl">Elvan Sürel</p>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Şifre Güncelle
        </button>
      </div>
      </div>
      <div className="w-4/5 h-40">
        <div className="bg-gray-200 my-5 text-center w-60 py-4 rounded-md">
          <h4 className="text-xl font-semibold">Aktif Öğrenci Sayısı</h4>
          <p className="text-3xl">{counterActiveUSer}</p>
        </div>
        <div className="grid text-center  grid-cols-4 gap-2">
          <div className="bg-gray-200 py-4 rounded-md">
            <h4 className="text-xl font-semibold">Kamp sayısı</h4>
            <p className="text-3xl">{counterCamp}</p>
          </div>
          <div className="bg-gray-200 py-4 rounded-md">
            <h4 className="text-xl font-semibold">Öğretmen Sayısı</h4>
            <p className="text-3xl">{counterTeach}</p>
          </div>
          <div className="bg-gray-200 py-4 rounded-md">
            <h4 className="text-xl font-semibold">Egzersiz Sayısı</h4>
            <p className="text-3xl">{counterExercise}</p>
          </div>
        </div>
      </div>
   
    </div>
  );
}
