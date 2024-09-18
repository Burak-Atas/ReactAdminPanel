import React, { useState, useRef } from 'react'
import Modal from 'react-modal'
import { X } from 'lucide-react'
import Select from 'react-select'

const Exercises = () => {
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [settings, setSettings] = useState(
    Array.from({ length: 35 }, (_, index) =>
      Array.from({ length: 25 }, () => ({
        duration: index % 2 === 0 ? '' : null, // Only some exercises have duration
        speed: '',
      }))
    )
  )
  const [showToast, setShowToast] = useState(false)
  const [showError, setShowError] = useState(false)
  const errorRef = useRef(null)

  const exerciseOptions = Array.from({ length: 35 }, (_, index) => ({
    value: index,
    label: `Egzersiz ${index + 1}`,
  }))

  const handleChange = (exerciseIndex, dayIndex, field, value) => {
    const newSettings = [...settings]
    newSettings[exerciseIndex][dayIndex][field] = value
    setSettings(newSettings)
  }

  const openModal = (selectedOption) => {
    setSelectedExercise(selectedOption.value)
    setShowError(false)
  }

  const closeModal = () => {
    setSelectedExercise(null)
  }

  const handleConfirm = () => {
    const exerciseSettings = settings[selectedExercise]
    let hasError = false

    for (let i = 0; i < exerciseSettings.length; i++) {
      const day = exerciseSettings[i]
      if (day.duration !== null && day.duration === '') {
        hasError = true
        errorRef.current = i
        break
      }
      if (day.speed === '') {
        hasError = true
        errorRef.current = i
        break
      }
    }

    if (hasError) {
      setShowError(true)
      setTimeout(() => {
        document.getElementById(`day-${errorRef.current}`).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100) // delay to ensure modal is fully opened
    } else {
      closeModal()
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000) // Hide toast after 3 seconds
    }
  }

  return (
    <div className="h-full w-full p-4">
      <div className="flex  mb-6">
        <h2 className="text-3xl font-semibold">EGZERSİZ SÜRE VE HIZ AYARI</h2>
      </div>
      <div className="flex justify-center mb-6 w-2/3 mx-auto">
        <Select
          options={exerciseOptions}
          onChange={openModal}
          placeholder="Egzersiz Seçin"
          className="w-full"
        />
      </div>

      {selectedExercise !== null && (
        <Modal
          isOpen={selectedExercise !== null}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          contentLabel="Egzersiz Ayarları"
        >
          <div className="bg-white h-3/4 p-6 rounded-lg shadow-lg w-full max-w-3xl relative overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Egzersiz {selectedExercise + 1} Ayarları
            </h3>
            {showError && (
              <div className="text-red-500 mb-4">
                Lütfen tüm alanları doldurun.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settings[selectedExercise].map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  id={`day-${dayIndex}`}
                  className="p-4 border rounded-lg shadow-md"
                >
                  <h4 className="text-md font-semibold mb-2">
                    Gün {dayIndex + 1}
                  </h4>
                  <div className="flex flex-col space-y-2">
                    {day.duration !== null && (
                      <input
                        type="text"
                        placeholder="Süre"
                        value={day.duration}
                        onChange={(e) =>
                          handleChange(
                            selectedExercise,
                            dayIndex,
                            'duration',
                            e.target.value
                          )
                        }
                        className="p-2 border rounded"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Hız"
                      value={day.speed}
                      onChange={(e) =>
                        handleChange(
                          selectedExercise,
                          dayIndex,
                          'speed',
                          e.target.value
                        )
                      }
                      className="p-2 border rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Onayla
            </button>
          </div>
        </Modal>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          Egzersizin hızları ayarlandı!
        </div>
      )}
    </div>
  )
}

export default Exercises
