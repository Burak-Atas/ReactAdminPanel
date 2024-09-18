import React, { useState } from 'react'

const studentsData = [
  {
    id: 1,
    name: 'Ali Veli',
    instructor: 'Ahmet Yılmaz',
    phone: '+90123-456-7894',
    joined: '01-01-2023',
  },
  {
    id: 2,
    name: 'Ayşe Fatma',
    instructor: 'Mehmet Can',
    phone: '+90123-456-7894',
    joined: '02-01-2023',
  },
  {
    id: 3,
    name: 'Hasan Hüseyin',
    instructor: 'Zeynep Kaya',
    phone: '+90123-456-7894',
    joined: '03-01-2023',
  },
  {
    id: 4,
    name: 'Elif Nur',
    instructor: 'Ali Kemal',
    phone: '+90123-456-7894',
    joined: '04-01-2023',
  },
  {
    id: 5,
    name: 'Mert Deniz',
    instructor: 'Fatma Aslan',
    phone: '+90123-456-7894',
    joined: '05-01-2023',
  },
]

const PasswordChange = () => {
  const [students, setStudents] = useState(studentsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChangePassword = (student) => {
    setSelectedStudent(student)
    setNewPassword('')
    setError('')
  }

  const closeModal = () => {
    setSelectedStudent(null)
  }

  const handleSavePassword = () => {
    if (!newPassword) {
      setError('Şifre alanı boş bırakılamaz')
      return
    }
    setSelectedStudent(null)
    setSuccessMessage(
      `Şifre başarılı bir şekilde değiştirildi: ${selectedStudent.name}`
    )
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-32 flex items-center">
        <h2 className="text-3xl font-semibold">ŞİFRE DEĞİŞTİRME</h2>
      </div>
      <input
        type="text"
        placeholder="Öğrenci Ara..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-center border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Öğrenci İsmi</th>
              <th className="border p-2">Eğitmen</th>
              <th className="border p-2">Telefon</th>
              <th className="border p-2">Katıldığı Tarih</th>
              <th className="border p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.instructor}</td>
                <td className="border p-2">{student.phone}</td>
                <td className="border p-2">{student.joined}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => handleChangePassword(student)}
                  >
                    İşlem Yap
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center w-full max-w-md mx-2">
            <h3 className="text-xl mb-4">
              Yeni Şifre Oluştur: {selectedStudent.name}
            </h3>
            <input
              type="password"
              placeholder="Yeni Şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              className="bg-green-500 text-white p-2 rounded mr-2"
              onClick={handleSavePassword}
            >
              Kaydet
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={closeModal}
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-4 right-4 bg-special_green text-white p-4 rounded shadow-lg">
          {successMessage}
        </div>
      )}
    </div>
  )
}

export default PasswordChange
