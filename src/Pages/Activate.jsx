import React, { useEffect, useState } from 'react'
import UserRow from '../Components/UserRow'
import Notification from '../Components/Notification'
import UserServices from '../Services/UserServices'

const usersData = [
  {
    name: 'Ali Yılmaz',
    level: 'Seviye 1',
    gender: 'Erkek',
    activate: false,
    user_type: 'Öğrenci',
    Katilma_Tarihi: '2023-01-10',
    phone_number: '555-111-2222',
  },
]


const Activate = () => {
  const [users, setUsers] = useState(usersData)
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '' })


  const [isOpenForm, setOpenForm] = useState(false)
  const [msg, setMsg] = useState('')

  const [formData, setFormData] = useState({
    id:String,
    name: '',
    user_name: '',
    phone_number: '',
    password: '',
    basari_puani:0,
    level: '',
    kayit_tarihi:'',
    activate :false,
    tamamlanan_gun:0,
  })
  const usr = new UserServices()

  useEffect(() => {
    usr
      .getUser()
      .then((response) => {
        setUsers(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
      })
  }, [])

  const handleApprove = (user_name) => {
    console.log(user_name);
  
    const formData = {
      user_name: user_name,
    };
  
    usr.Activate(formData, "").then((response) => {
      if (response.status === 200) {
        console.log("Kullanıcı onaylandı");
      } else {
        console.log("Kullanıcı onaylanamadı");
      }
    }).catch((error) => {
      console.error("Hata oluştu:", error);
    });
  };
  

  const handleDelete = (user_name) => {
    const deletedUser = users.find((user) => user.user_name === user_name);
    
    if (!deletedUser) {
      setNotification({
        message: `Kullanıcı bulunamadı.`,
        type: 'error',
      });
      return;
    }
  
    const updatedUsers = users.filter((user) => user.user_name !== user_name);
    
    console.log(deletedUser.user_name, "tıklandı");
  
    usr.delUser('', deletedUser.user_name)
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          setUsers(updatedUsers);
          setNotification({
            message: `${deletedUser.name} isimli kullanıcı silindi.`,
            type: 'success',
          });
        } else {
          setNotification({
            message: `${deletedUser.name} isimli kullanıcı silinirken hata oluştu.`,
            type: 'error',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setNotification({
          message: `Kullanıcı silinirken bir hata oluştu.`,
          type: 'error',
        });
      });
  };
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full h-full p-4">
      <Notification message={notification.message} type={notification.type} />
      <div className="h-32 flex items-center justify-between">
        <header className="text-3xl font-semibold">ONAY İŞLEMLERİ</header>
        <input
          type="text"
          placeholder="Ara..."
          className="border rounded px-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-auto">
        <table className="min-w-full mt-4 border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">İsim</th>
              <th className="border px-4 py-2">Kullanıcı Adı</th>
              <th className="border px-4 py-2">Telefon</th>
              <th className="border px-4 py-2">Eğitim Durumu</th>
              <th className="border px-4 py-2">Ekleyen</th>
              <th className="border px-4 py-2">Onay Durumu</th>
              <th className="border px-4 py-2">Rol</th>
              <th className="border px-4 py-2">Katılma Tarihi</th>
              <th className="border px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Activate
