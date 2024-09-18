import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import UserServices from '../Services/UserServices';
import ExerciseServices from '../Services/ExerciseServices';

const StudentReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [students, setStudents] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState(null); // Hata durumu

  const usr = new UserServices();
  const exr = new ExerciseServices();

  useEffect(() => {
    setLoading(true);
    usr.getUser()
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("User fetch error:", err);
        setError("Öğrenciler alınırken bir hata oluştu.");
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStudent = (student) => {
    setLoading(true);
    exr.getExercise(student.level)
      .then(response => {
        setExercises(response.data);
        setSelectedStudent(student);
        setSelectedExercise(null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Exercise fetch error:", err);
        setError("Egzersizler alınırken bir hata oluştu.");
        setLoading(false);
      });
  };

  const handleSelectExercise = (exercise) => {
    setLoading(true);
    if (selectedStudent) {
      exr.getExerciseDetails({
        "user_name": selectedStudent.user_name,
        "exercise_name": exercise.name
      }).then(response => {
        if (Array.isArray(response.data)) {
          setDailyProgress(response.data);
        } else {
          console.error("Beklenmeyen veri formatı:", response.data);
          setDailyProgress([]);
        }
        setSelectedExercise(exercise);
        setLoading(false);
      }).catch(err => {
        console.error("Exercise details fetch error:", err);
        setError("Egzersiz detayları alınırken bir hata oluştu.");
        setLoading(false);
      });
    } else {
      console.error("Seçili öğrenci mevcut değil.");
      setError("Öğrenci bilgisi bulunamadı.");
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setSelectedExercise(null);
  };

  if (loading) {
    return <p className="text-center">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-32 flex items-center">
        <h2 className="text-3xl font-semibold">ÖĞRENCİ ANALİZİ</h2>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Öğrenci ismini arayın..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-center">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">İsim</th>
              <th className="py-2 px-4 border-b">Eğitmen</th>
              <th className="py-2 px-4 border-b">Katıldığı Tarih</th>
              <th className="py-2 px-4 border-b">İlerleme Yüzdesi</th>
              <th className="py-2 px-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              filteredStudents.map((student) => (
                student.user_type === "STUDENT" ? (
                  <tr key={student.user_name}>
                    <td className="py-2 px-4 border-b">{student.name}</td>
                    <td className="py-2 px-4 border-b">{student.added}</td>
                    <td className="py-2 px-4 border-b">{student.kayit_tarihi}</td>
                    <td className="py-2 px-4 border-b">{student.progress}%</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleSelectStudent(student)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        Analizi Görüntüle
                      </button>
                    </td>
                  </tr>
                ) : null
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 border-b">Yükleniyor...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">
            {selectedStudent.name} - Detaylı Analiz
            <X
              onClick={closeModal}
              className="cursor-pointer absolute right-16"
              color="#ff0000"
            />
          </h3>

          <div className="mb-4">
            <div className="flex flex-wrap gap-4 overflow-x-auto">
              {exercises.length > 0 ? (
                exercises.map((exercise) => (
                  <div
                    key={exercise.name}
                    className="bg-gray-100 p-4 rounded shadow-md cursor-pointer w-full sm:w-48"
                    onClick={() => handleSelectExercise(exercise)}
                  >
                    <h5 className="text-md font-semibold">{exercise.name}</h5>
                  </div>
                ))
              ) : (
                <p className="text-center">Egzersiz bulunmamaktadır.</p>
              )}
            </div>
          </div>

          {selectedExercise && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white p-4 rounded max-w-2xl w-full h-5/6 overflow-auto relative">
                <h4 className="text-lg font-semibold mb-2">
                  {selectedExercise.name} - Raporu
                </h4>
                <X
                  onClick={() => setSelectedExercise(null)}
                  className="cursor-pointer absolute top-0 right-0 m-4"
                  color="#ff0000"
                />
                {Array.isArray(dailyProgress) && dailyProgress.length === 0 ? (
                  <p className="text-center">Bu egzersiz için veri bulunmamaktadır.</p>
                ) : Array.isArray(dailyProgress) ? (
                  <table className="min-w-full bg-white text-center">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Gün</th>
                        {selectedExercise.type === 'accuracyBased' && (
                          <>
                            <th className="py-2 px-4 border-b">Doğru</th>
                            <th className="py-2 px-4 border-b">Yanlış</th>
                          </>
                        )}
                        <th className="py-2 px-4 border-b">Süre (dk)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyProgress.map((dayProgress) => (
                        <tr key={dayProgress.day}>
                          <td className="py-2 px-4 border-b">{dayProgress.exercise_day}</td>
                          {selectedExercise.type === 'accuracyBased' && (
                            <>
                              <td className="py-2 px-4 border-b">{dayProgress.correct}</td>
                              <td className="py-2 px-4 border-b">{dayProgress.incorrect}</td>
                            </>
                          )}
                          <td className="py-2 px-4 border-b">{dayProgress.time} dk</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center">Beklenmeyen veri formatı.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentReport;
