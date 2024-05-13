import React, { useRef, useState } from "react";

export default function Calendar() {
  const [formIsOpen, setFormOpen] = useState(false);
  const [taskList, setTaskList] = useState([
    {
      title: "Burak Ataş ile Görüşme",
      date: "15.05.2024",
      time: "15.00",
      content: "takitoskop egzersizi hakkın",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [isOpenTask,setOpenTask]= useState(false)

  const handleContentButton = ()=>{
setOpenTask(!isOpenTask)
  }

  const handleSaveButton = () => {
    setFormOpen(!formIsOpen);
  };

  const handleSubmit = () => {
    const newMessage = {
      title: formData.title,
      content: formData.content,
      sender_username: formData.user_name,
      send_time: "Şimdi",
      send_date: new Date().toLocaleDateString(),
    };

    setFormData({
      title: "",
      date: "",
      time: "",
      content: "",
    });
  };

  return (
    <div>
      {formIsOpen && (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5">
          <div className="absolute top-0 right-0 m-2">
            <button
              onClick={handleSaveButton}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded"
            >
              X
            </button>
          </div>
          <div className="w-96 h-3/6 bg-slate-200 p-10">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Başlık
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="date"
                >
                  Tarih
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="date"
                  type="text"
                  placeholder="Tarih"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="time"
                >
                  Saat
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="time"
                  type="text"
                  placeholder="Saat"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Mesaj İçeriği"
              value={formData.content}
              onChange={handleInputChange}
              name="content"
            ></textarea>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}
      <div className="h-40 flex items-center">
        <button
          onClick={handleSaveButton}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Görev Ekle
        </button>
      </div>
      <div className="flex">
        {taskList.map((value, index) => (
          <div key={index} className="flex flex-col">
            <button
              onClick={handleContentButton}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {value.title}
            </button>
            {isOpenTask&&(
              <div>
              <p>{value.content}</p>
              <p>{value.time}</p>
              <p>{value.date}</p>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}
