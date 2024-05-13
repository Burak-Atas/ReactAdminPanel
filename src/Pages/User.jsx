import React, { useState, useEffect } from 'react';
import UserServices from '../Services/UserServices';

export default function User() {
    const [isOpenForm, setOpenForm] = useState(false);
    const [msg, setMsg] = useState('');

    const [formData, setFormData] = useState({
        name : '',
        user_name: '',
        phone_number: '',
        password: '',
        level:'',
    });
    const usr = new UserServices();

/*
    const initialUsers = [
        {
            "name": "burak",
            "user_name": "ataş",
            "puan": 100,
            "phone_number":"5313277665",
            "password":"Burak1234",
            "level": 1 // Örnek bir seviye atanmış

        },
        {
            "name": "mahmut",
            "user_name": "ataş",
            "puan": 80,
            "phone_number":"5313277665",
            "password":"Burak1234",
            "level": 1 // Örnek bir seviye atanmış


        },
        {
            "name": "deneme",
            "user_name": "ataş",
            "puan": 90,
            "phone_number":"5313277665",
            "password":"Burak1234",

            "level": 1
        }
    ];
*/
    const [users, setUsers] = useState([]);

    const deleteUser = (index) => {
        const newUsers = [...users];
        newUsers.splice(index, 1);
        setUsers(newUsers);
    };

    // Function to filter users based on score
    const filterUsersByScore = (score) => {
        const filteredUsers = users.filter(user => user.puan >= score);
        setUsers(filteredUsers);
    };

    useEffect(() => {
        // Assuming getUsers is a function in UserServices to fetch users
        usr.getUser()
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, []);

    // Function to reset the users array to its original state
    const resetUsers = () => {
        setUsers(users);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        usr.AddUser(formData, "")
            .then(response => {
                if (response.status===200){
                    setMsg(response.data.message)
                    setUsers([...users, formData]); // Varsayılan olarak varsayılan kullanıcılar ve yeni eklenen kullanıcıyı birleştir
                }else{
                    setMsg("kullanıcı eklenemedi")
                }
            })
            .catch(error => {
                console.error("Hata oluştu:", error); // Hata durumunda konsola hata mesajını yazdır
            });
    };
    

    const OpenForm = () => {
        setOpenForm(true);
    };

    const closeForm = () => {
        setOpenForm(false);
    };

    // Function to sort users by score in descending order
    const sortUsersByScoreDescending = () => {
        const sortedUsers = [...users].sort((a, b) => b.puan - a.puan);
        setUsers(sortedUsers);
    };

    return (
        <div className='w-full'>
            {isOpenForm && (
                <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5'>
                    <div className='absolute top-0 right-0 m-2'>
                        <button onClick={closeForm} className='bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded'>
                            X
                        </button>
                    </div>
                    <div className='w-96 h-3/6 bg-slate-200 p-10'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
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
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefon">
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
                        <div className='flex items-center justify-between'>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
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
                        
                        {
                            msg !== "" && (
                                <div className='w-full flex justify-center'>
                                    <span className='text-red-500'>{msg}</span>
                                </div>
                            )
                        }
                        <button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            Kaydet
                        </button>
                    </div>
                </div>
            )}

            {isOpenForm && <div className='bg-gray-200 opacity-50 fixed inset-0 z-40'></div>}

            <div className='h-32 flex items-center'>
                <h2 className='text-6xl'>KULLANICILAR</h2>
            </div>
            <div className='flex justify-between'>
                <div className='flex'>
                    <div className='m-2'>
                        <button onClick={() => resetUsers()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            Tüm Kullanıcıları Göster
                        </button>
                    </div>
                    <div className='m-2'>
                        <button onClick={() => sortUsersByScoreDescending()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            Puana Göre Azalan Sırala
                        </button>
                    </div>
                </div>
                <div>
                    <button onClick={() => OpenForm()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Kullanıcı ekle
                    </button>
                </div>
            </div>
            <div className= 'flex flex-col my-5'>
                <div className='flex bg-gray-200 p-2 font-bold'>
                    <div className='w-1/6'>Ad Soyad</div>
                    <div className='w-1/6'>Kullanıcı Adı</div>
                    <div className='w-1/6'>Puan</div>
                    <div className='w-1/6'>Telefon</div>
                    <div className='w-1/6'>Şifre</div>
                    <div className='w-1/6'>Seviye</div>
                </div>
                {users.map((user, index) => (
                    <div key={index} className='flex bg-white p-2 border border-gray-300'>
                        <div className='w-1/6'>{user.name}</div>
                        <div className='w-1/6'>{user.user_name}</div>
                        <div className='w-1/6'>{user.puan}</div>
                        <div className='w-1/6'>{user.phone_number}</div>
                        <div className='w-1/6'>{user.password}</div>
                        <div className='w-1/6'>{user.level}</div>
                        <button onClick={() => deleteUser(index)} className="ml-auto bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                            Sil
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
