import React, { useEffect, useState } from 'react'
//import PDFGenerator from '../Components/PDFGenerator'
import PDFGenerator, { generatePDF } from '../Components/PDFGenerator'
import UserServices from '../Services/UserServices'

const users = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    level: '1. Seviye',
    startDate: '2024-01-10',
    endDate: '2024-06-10',
    teacher: 'Elvan Sürel',
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    level: '2. Seviye',
    startDate: '2024-02-15',
    endDate: '2024-07-15',
    teacher: 'Elvan Sürel',
  },
  {
    id: 3,
    name: 'Ayşe Demir',
    level: '3. Seviye',
    startDate: '2024-03-20',
    endDate: '2024-08-20',
    teacher: 'Elvan Sürel',
  },
  {
    id: 4,
    name: 'Fatma Çelik',
    level: '1. Seviye',
    startDate: '2024-04-25',
    endDate: '2024-09-25',
    teacher: 'Elvan Sürel',
  },
  {
    id: 5,
    name: 'Ali Vural',
    level: '2. Seviye',
    startDate: '2024-05-30',
    endDate: '2024-10-30',
    teacher: 'Elvan Sürel',
  },
  {
    id: 6,
    name: 'Elif Öztürk',
    level: '3. Seviye',
    startDate: '2024-06-05',
    endDate: '2024-11-05',
    teacher: 'Elvan Sürel',
  },
  {
    id: 7,
    name: 'Hasan Aydın',
    level: '1. Seviye',
    startDate: '2024-07-10',
    endDate: '2024-12-10',
    teacher: 'Elvan Sürel',
  },
  {
    id: 8,
    name: 'Zeynep Korkmaz',
    level: '2. Seviye',
    startDate: '2024-08-15',
    endDate: '2025-01-15',
    teacher: 'Elvan Sürel',
  },
  {
    id: 9,
    name: 'Mert Taş',
    level: '3. Seviye',
    startDate: '2024-09-20',
    endDate: '2025-02-20',
    teacher: 'Elvan Sürel',
  },
  {
    id: 10,
    name: 'Nur Karaca',
    level: '1. Seviye',
    startDate: '2024-10-25',
    endDate: '2025-03-25',
    teacher: 'Elvan Sürel',
  },
]

const Report = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setusers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    readingSpeedStart: '',
    readingSpeedEnd: '',
    silentReadingSpeedStart: '',
    silentReadingSpeedEnd: '',
    comprehensionRateStart: '',
    comprehensionRateEnd: '',
    readingSpeedIncreaseRateStart: '',
    readingSpeedIncreaseRateEnd: '',
    exerciseCompletionRateStart: '',
    exerciseCompletionRateEnd: '',
    instructorComments: '',
  })

  const usr = new UserServices();

  useEffect(() => {
    usr.getUser("").then((response) => {
      console.log(response);
      setusers(response.data);
    });


  }, []); // boş bağımlılık dizisi, useEffect'in yalnızca bileşen ilk yüklendiğinde çalışmasını sağlar


  const handleUserClick = (user) => {
    setSelectedUser(user)
  }

  const handleCreateReport = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-32 flex items-center">
        <header className="text-3xl font-semibold">KARNE OLUŞTURMA</header>
      </div>
      <div className="mt-8 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Adı Soyadı</th>
                <th className="py-2 px-4 border-b">Seviye</th>
                <th className="py-2 px-4 border-b">Kurs Başlama Tarihi</th>
                <th className="py-2 px-4 border-b">Kurs Bitiş Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.level}</td>
                  <td className="py-2 px-4 border-b">{user.kayit_tarihi}</td>
                  <td className="py-2 px-4 border-b">{user.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full md:w-1/2 pl-0 md:pl-4 mt-4 md:mt-0">
          {selectedUser && (
            <div className="p-4 border rounded-lg bg-gray-100">
              <h2 className="text-2xl font-semibold mb-4">Seçilen Öğrenci</h2>
              <p>
                <strong>Adı Soyadı:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Seviye:</strong> {selectedUser.level}
              </p>
              <p>
                <strong>Kurs Başlama Tarihi:</strong> {selectedUser.startDate}
              </p>
              <p>
                <strong>Kurs Bitiş Tarihi:</strong> {selectedUser.endDate}
              </p>
              <button
                onClick={handleCreateReport}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Karnesini Oluştur
              </button>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg max-h-full mt-36 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-red-500"
            >
              X
            </button>
            <h2 className="text-2xl font-semibold mb-4">Kurs Sonu Değerler</h2>
            <div className="overflow-y-auto max-h-80">
              <div className="mb-4">
                <label>Sesli Okuma Hızı (Kelime/dk):</label>
                <div className="flex">
                  <input
                    type="text"
                    name="readingSpeedStart"
                    placeholder="Başlangıç"
                    value={formData.readingSpeedStart}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                  <input
                    type="text"
                    name="readingSpeedEnd"
                    placeholder="Bitiş"
                    value={formData.readingSpeedEnd}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Sessiz Okuma Hızı (Kelime/dk):</label>
                <div className="flex">
                  <input
                    type="text"
                    name="silentReadingSpeedStart"
                    placeholder="Başlangıç"
                    value={formData.silentReadingSpeedStart}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                  <input
                    type="text"
                    name="silentReadingSpeedEnd"
                    placeholder="Bitiş"
                    value={formData.silentReadingSpeedEnd}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Anlama Oranı (%):</label>
                <div className="flex">
                  <input
                    type="text"
                    name="comprehensionRateStart"
                    placeholder="Başlangıç"
                    value={formData.comprehensionRateStart}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                  <input
                    type="text"
                    name="comprehensionRateEnd"
                    placeholder="Bitiş"
                    value={formData.comprehensionRateEnd}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Okuma Hızı Artış Oranı (%):</label>
                <div className="flex">
                  <input
                    type="text"
                    name="readingSpeedIncreaseRateStart"
                    placeholder="Başlangıç"
                    value={formData.readingSpeedIncreaseRateStart}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Egzersiz Tamamlama Oranı (%):</label>
                <div className="flex">
                  <input
                    type="text"
                    name="exerciseCompletionRateStart"
                    placeholder="Sonuç"
                    value={formData.exerciseCompletionRateStart}
                    onChange={handleInputChange}
                    className="border p-2 m-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Eğitici Görüşü:</label>
                <textarea
                  name="instructorComments"
                  placeholder="Eğitici Görüşü"
                  value={formData.instructorComments}
                  onChange={handleInputChange}
                  className="border p-2 m-2 w-full h-24"
                />
              </div>
              <PDFGenerator selectedUser={selectedUser} formData={formData} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Report
