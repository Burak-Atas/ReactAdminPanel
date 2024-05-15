import React, { useState, useRef, useEffect } from "react";
import MessagesServices from "../Services/MessageServices";

export default function Communications() {
  const [formIsOpen, setFormOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    header: "",
    user_name: "",
    content: "",
    date:"",
    sender:"",
    time:""
  });

  useEffect(() => {
    // Assuming getUsers is a function in UserServices to fetch users
    msgServices.getMessages()
        .then(response => {
          if(response.status===200){
            setMessages(response.data);
          }
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
}, []);

  


  const msgServices = new MessagesServices();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    const newMessage = {
      header: formData.header,
      content: formData.content,
      sender_username: formData.user_name,
      time: "",
      date: new Date().toLocaleDateString(),
    };
  
    msgServices.AddMessages(newMessage, "")
      .then(response => {
        if (response.status === 200) {
          setMsg(response.data.message)
          setMessages([...messages, newMessage]);
          setMsg("bildiri gönderildi")

        } else {
          setMsg("bildiri gönderilemedi")
        }
      })
      .catch(error => {
        console.error("Hata oluştu:", error);
      });
  
    setFormData({
      header: "",
      user_name: "",
      content: "" // content'i de sıfırla
    });
  };
  
  const handleDelete = (index) => {
    const deletedMessage = messages[index].header; // Silinen mesajın başlığını al
    msgServices.delMessages(deletedMessage,"")

    .then(response => {
      if (response.status === 200) {
        const newMessages = [...messages];
        newMessages.splice(index, 1);
        setMessages(newMessages);
      } else {
        setMsg("istek şuanda siliemiyor")
      }
    })
    .catch(error => {
      console.error("Hata oluştu:", error);
    });
  
    // deletedMessage değişkeni içinde silinen mesajın başlığı bulunmaktadır.
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="header">
                Başlık
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="header"
                type="text"
                placeholder="header"
                name="header"
                value={formData.header}
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
  value={formData.content} // formData.content'i kullan
  onChange={(e) => setFormData({ ...formData, content: e.target.value })} // onChange'i düzelt
></textarea>

        {
          msg!==""&&(
            <div>
              {msg}
            </div>
          )
        }

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
              {message.header}
            </h3>
            <div className="border-b border-gray-300 mb-2"></div>
            <p className="text-base text-gray-600">{message.content}</p>
            <div>
              <p className="text-xs absolute bottom-8 text-gray-500">
                Gönderen: {message.sender}
              </p>
            </div>
            <div className="absolute bottom-2">
              <p className="text-xs font-semibold text-gray-600">
                Gönderim Zamanı: {message.times}, Tarih: {message.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
