import React, { useState, useEffect } from "react";
import UserServices from "../Services/UserServices";

export default function User() {
  const [isOpenForm, setOpenForm] = useState(false);
  const [editOpenForm, setEditOpenForm] = useState(false);

  const [isOpenFormTeacher, setOpenFormTeacher] = useState(false);
  const [active, setActive] = useState(false);
  const [msg, setMsg] = useState("");

  var token = localStorage.getItem("token");

  useEffect(() => {
    console.log("token değeri user", token);
    if (token === null) {
      return "token bulunamadı";
    }
  }, []); // Bağımlılık listesine boş bir dizi ekleyin

  const [formData, setFormData] = useState({
    name: "",
    user_name: "",
    phone_number: "",
    password: "",
    level: "1", // Varsayılan değer
  });

  const [formDataTeacher, setFormDataTeacher] = useState({
    name: "",
    user_name: "",
    email: "",
    password: "",
  });

  const usr = new UserServices();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("ödnerilne ", token);
    usr
      .getUser(token)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const deleteUser = (index, user_name) => {
    const newUsers = [...users];
    usr
      .delUser(token, user_name)
      .then((response) => {
        if (response.status === 200) {
          newUsers.splice(index, 1);
          setUsers(newUsers);
        }
        console.log(response);
      })
      .catch((err) => {
        alert("işlem yapılırken hata oluştu" + err);
      });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(`Updated ${e.target.name}: ${e.target.value}`);
  };

  const handleSubmit = () => {
    console.log("Submitting form with data:", formData);
    usr
      .AddUser(formData, token)
      .then((response) => {
        if (response.status === 200) {
          setMsg(response.data.message);
          setUsers([...users, formData]);
        } else {
          setMsg("kullanıcı eklenemedi");
        }
      })
      .catch((error) => {
        console.error("Hata oluştu:", error);
      });
  };

  const handleSubmitTeacher = () => {
    usr
      .AddTeacher(formDataTeacher, token)
      .then((response) => {
        if (response.status === 200) {
          setMsg(response.data.message);
          setFormDataTeacher([...users, formData]);
        } else {
          setMsg("kullanıcı eklenemedi");
        }
      })
      .catch((error) => {
        console.error("Hata oluştu:", error);
      });
  };

  const OpenForm = () => {
    setOpenForm(true);
  };

  const OpenFormTeacher = () => {
    setOpenFormTeacher(true);
  };
  const handleInputChangeTeacher = (e) => {
    setFormDataTeacher({
      ...formDataTeacher,
      [e.target.name]: e.target.value,
    });
    console.log(`Updated ${e.target.name}: ${e.target.value}`);
  };

  const closeForm = () => {
    setOpenForm(false);
  };

  const closeFormTeacher = () => {
    setOpenFormTeacher(false);
  };
  const closeEditForm = () => {
    setEditOpenForm(false);
  };

  const sortUsersByScoreDescending = () => {
    const sortedUsers = [...users].sort((a, b) => b.puan - a.puan);
    setUsers(sortedUsers);
  };

  const resetUsers = () => {
    setUsers(users);
  };

  const EditOpenForm = (user) => {
    setEditOpenForm(true);
    setFormData({
      name: user.name,
      user_name: user.user_name,
      phone_number: user.phone_number,
      password: user.password,
      level: user.level,
    });
  };

  const EditHandle = () => {
    console.log("Updating user with data:", formData); // Debugging log
    usr
      .updateUser(token, formData)
      .then((response) => {
        if (response.status === 200) {
          setMsg(response.data.message);
          // Optionally refresh the list of users
        } else {
          setMsg("Kullanıcı güncellenemedi");
        }
      })
      .catch((error) => {
        console.error("Hata oluştu:", error);
      });
  };
  const handleInputChangeEdit = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(`Updated ${name}: ${value}`); // Ensure this logs correctly
  };

  return (
    <div className="w-full">
      {isOpenForm && (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5">
          <div className="absolute top-0 right-0 m-2">
            <button
              onClick={closeForm}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded"
            >
              X
            </button>
          </div>
          <div className="w-96 h-3/6 bg-slate-200 p-10">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Ad Soyad
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="user_name"
              >
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
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="telefon"
              >
                Telefon
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone_number"
                type="text"
                placeholder="Telefon "
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Şifre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="text"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="level"
                >
                  Seviye
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
            {msg !== "" && (
              <div className="w-full flex justify-center">
                <span className="text-red-500">{msg}</span>
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}
      {editOpenForm && (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5">
          <div className="absolute top-0 right-0 m-2">
            <button
              onClick={closeEditForm}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded"
            >
              X
            </button>
          </div>
          <div className="w-96 h-3/6 bg-slate-200 p-10">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Ad Soyad
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="name"
                name="name"
                value={formData.name}
                onChange={handleInputChangeEdit}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="user_name"
              >
                kullanıcı adı
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="user_name"
                type="text"
                placeholder="Email"
                name="user_name"
                value={formData.user_name}
                disabled
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="telefon"
              >
                Telefon
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone_number"
                type="text"
                placeholder="Telefon "
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChangeEdit}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Şifre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="text"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChangeEdit}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="level"
                >
                  Seviye
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChangeEdit}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
            {msg !== "" && (
              <div className="w-full flex justify-center">
                <span className="text-red-500">{msg}</span>
              </div>
            )}
            <button
              onClick={EditHandle}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Güncelle
            </button>
          </div>
        </div>
      )}
      {isOpenFormTeacher && (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5">
          <div className="absolute top-0 right-0 m-2">
            <button
              onClick={closeFormTeacher}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded"
            >
              X
            </button>
          </div>
          <div className="w-96 h-3/6 bg-slate-200 p-10">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Ad Soyad
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Ad Soyad"
                name="name"
                value={formDataTeacher.name}
                onChange={handleInputChangeTeacher}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="user_name"
              >
                Kullanıcı Adı
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="user_name"
                type="text"
                placeholder="Kullanıcı Adı"
                name="user_name"
                value={formDataTeacher.user_name}
                onChange={handleInputChangeTeacher}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Email"
                name="email"
                value={formDataTeacher.email}
                onChange={handleInputChangeTeacher}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Şifre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Şifre"
                name="password"
                value={formDataTeacher.password}
                onChange={handleInputChangeTeacher}
              />
            </div>
            {msg && (
              <div className="w-full flex justify-center">
                <span className="text-red-500">{msg}</span>
              </div>
            )}
            <button
              onClick={handleSubmitTeacher}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      <div className="h-32 flex items-center">
        <h2 className="text-3xl font-semibold">KULLANICILAR</h2>
      </div>
      <div className="m-5">
        <button
          onClick={OpenForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ekle
        </button>
        <button
          onClick={OpenFormTeacher}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Öğretmen Ekle
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Son Görülme</th>
              <th className="px-4 py-2">Ad Soyad</th>
              <th className="px-4 py-2">Kullanıcı Adı</th>
              <th className="px-4 py-2">Telefon</th>
              <th className="px-4 py-2">Şifre</th>
              <th className="px-4 py-2">Seviye</th>
              <th className="px-4 py-2">Kullanıcı Tipi</th>

              <th className="px-4 py-2">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {user.last_seen_data
                    ? (() => {
                        // last_seen_data'yı boşluğa göre ikiye ayır
                        const [lastDate, lastTime] =
                          user.last_seen_data.split(" ");
                        const lastSeenDateTime = new Date(
                          `${lastDate}T${lastTime}`
                        );

                        const now = new Date();
                        const timeDifferenceMs = now - lastSeenDateTime;
                        const timeDifferenceMinutes =
                          timeDifferenceMs / (1000 * 60);

                        console.log(
                          "timeDifferenceMinutes",
                          timeDifferenceMinutes
                        );
                        if (timeDifferenceMinutes < 5) {
                          return "Aktif";
                        } else if (timeDifferenceMinutes < 60) {
                          return `${Math.floor(
                            timeDifferenceMinutes
                          )} dakika önce`;
                        } else {
                          return `${Math.floor(
                            timeDifferenceMinutes / 60
                          )} saat önce`;
                        }
                      })()
                    : "Bilgi yok"}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    user.user_type === "ADMIN" || user.user_type === "TEACHER"
                      ? "bg-yellow-500"
                      : ""
                  }`}
                >
                  {user.name}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    user.user_type === "ADMIN" || user.user_type === "TEACHER"
                      ? "bg-yellow-500"
                      : ""
                  }`}
                >
                  {user.user_name}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    user.user_type === "ADMIN" || user.user_type === "TEACHER"
                      ? "bg-yellow-500"
                      : ""
                  }`}
                >
                  {user.phone_number || user.email}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    user.user_type === "ADMIN" || user.user_type === "TEACHER"
                      ? "bg-yellow-500"
                      : ""
                  }`}
                >
                  {user.password}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    user.user_type === "ADMIN" || user.user_type === "TEACHER"
                      ? "bg-yellow-500"
                      : ""
                  }`}
                >
                  {user.level}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    user.user_type === "ADMIN" || user.user_type === "TEACHER"
                      ? "bg-yellow-500"
                      : ""
                  }`}
                >
                  {user.user_type}
                </td>

                <td className="border px-4 py-2">
                  <button
                    onClick={() => deleteUser(index, user.user_name)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => EditOpenForm(user)}
                    className="bg-yellow-500 hover:bg-red-700 mx-2 text-white font-bold py-1 px-2 rounded"
                  >
                    düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
