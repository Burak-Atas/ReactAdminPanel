import React, { useState, useRef } from "react";

export default function Communications() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formIsOpen, setFormOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      title: "Merhaba",
      content: "Arkadaşlar, yarın aynıma gelebilir misiniz?",
      sender_username: "burakatass",
      send_time: "Şimdi",
      send_date: "15/09",
    },
    {
      title: "Selam",
      content: "Hey, topluluğa katılmak ister misiniz?",
      sender_username: "burakatass",
      send_time: "Şimdi",
      send_date: "15/09",
    },
    {
      title: "Merhaba",
      content: "Yarın buluşmak için hazır mısınız?",
      sender_username: "burakatass",
      send_time: "Şimdi",
      send_date: "15/09",
    },
  ]);


  
  const titleInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    user_name: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    const newMessage = {
      title: formData.title,
      content,
      sender_username: formData.user_name,
      send_time: "Şimdi",
      send_date: new Date().toLocaleDateString(),
    };

    setMessages([...messages, newMessage]);
    setFormData({
      title: "",
      user_name: ""
    });
  };

  const handleDelete = (index) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const handleSaveButton = () => {
    setFormOpen(!formIsOpen);
  };

  return (
    <div className="w-full">
      <div className="h-32 flex items-center ">
        <h2 className="text-6xl font-bold text-gray-800">İLETİŞİM</h2>
      </div>

      <div className="my-5 w-full  flex justify-end">
        <button onClick={handleSaveButton} className="bg-blue-500 hover:bg-blue-400 mr-16 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Bildiri Gönder
        </button>{" "}
      </div>

      {formIsOpen && (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5">
          <div className="absolute top-0 right-0 m-2">
            <button onClick={handleSaveButton} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded">
              X
            </button>
          </div>
          <div className="w-96 h-3/6 bg-slate-200 p-10">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_name">
                kullanıcı adı
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="user_name"
                type="text"
                placeholder="Email"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
              />
            </div>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Mesaj içeriği"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Kaydet
            </button>
          </div>
        </div>
      )}


      <div className="flex flex-wrap w-full  items-start ">
        {messages.map((message, index) => (
          <div
            key={index}
            className="message-card mx-5 w-96 h-60 p-4 mb-4 border rounded-lg relative shadow-md"
          >
            <button
              className="absolute top-2 right-2 text-xs text-red-500"
              onClick={() => handleDelete(index)}
            >
              Sil
            </button>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              {message.title}
            </h3>
            <div className="border-b border-gray-300 mb-2"></div>
            <p className="text-base text-gray-600">{message.content}</p>
            <div>
              <p className="text-xs absolute bottom-8 text-gray-500">
                Gönderen: {message.sender_username}
              </p>
            </div>
            <div className="absolute bottom-2">
              <p className="text-xs font-semibold text-gray-600">
                Gönderim Zamanı: {message.send_time}, Tarih: {message.send_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
