import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import UserServices from "../Services/UserServices";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const [formdata,setFormData] = useState({
    "email":"",
    "code":"",
    "password":"",
    "rpassword":"",
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = {
      username,
      password,
    };
    const usr = new UserServices();

    try {
      const data = await usr.Login(loginData);

      if (data.data.token) {
        localStorage.setItem("token", data.data.token); // Update this line
        navigate("/"); // Redirect to home page
        console.log(data.data);
      } else {
        alert("Giriş hatası oluştu");
      }
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const [form, setform] = useState(false);
  const [viewCode,setViewCode] =useState('');


  const handleTakeCode = ()=>{
    const usr = new UserServices();
    usr.getCode(formdata.email).then((response)=>{
      if(response.status){
        setViewCode(true)
      }
    })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
    console.log(`Updated ${e.target.name}: ${e.target.value}`);
  };

  const updatePassword = (formData)=>{
    console.log(formData)
    const usr = new UserServices();
    usr.updatePassword(formdata).then((response)=>{
      if(response.status){
        alert(response.data.message)
      }else{
        alert(response.data.error)
      }
    }
  )
  }

  return (
    <section className="bg-gray-50 relative ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-3xl font-semibold text-gray-900 "
        >
          Gelis<span className="text-special_green">trio</span>
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white">
              Admin Hesabınız ile Giriş Yapın
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Beni Hatırla
                    </label>
                  </div>
                </div>
                <a
                  onClick={() => {
                    setform(true);
                  }}
                  className="text-sm font-medium text-special_green hover:underline dark:text-primary-500"
                >
                  Şifremi Unuttum
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-special_green focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
      {form && (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
      <button
        onClick={() => setform(false)}
        className="absolute right-4 top-4 text-gray-600 text-2xl hover:text-gray-800"
      >
        &times;
      </button>
      <h3 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Şifre Güncelleme
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Lütfen mailinizi giriniz
          </label>
          <input
            type="email"
            className="mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={handleInputChange}
            name="email"
            value={formdata.email}
            disabled={viewCode} // Kod alındıktan sonra e-posta değiştirilemez
          />
          <button
            className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            onClick={handleTakeCode}
            disabled={viewCode} // Kod alındıktan sonra buton devre dışı kalır
          >
            Kod Al
          </button>
        </div>

        {viewCode && (
          <div>
            <div className="mt-5">
              <input
                type="text"
                className="mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Kodu giriniz"
                name="code"
                value={formdata.code}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-2">
                Mailinizi lütfen kontrol edin
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="block text-gray-700">
                Yeni Şifre
              </label>
              <input
                type="password"
                className="mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name="password"
                value={formdata.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="rpassword" className="block text-gray-700">
                Yeni Şifrenizi Tekrar Girin
              </label>
              <input
                type="password"
                className="mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name="rpassword"
                value={formdata.rpassword}
                onChange={handleInputChange}
              />
            </div>

            <button
              className="mt-5 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => updatePassword(formdata)}
            >
              Şifreyi Güncelle
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </section>
  );
};

export default LoginPage;
