import React, { useState, useEffect } from 'react'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const FastRead = ({ dayNumber }) => {
  const [isStart, setIsstart] = useState(false)

  const startScreen = () => {
    setIsstart(true)
  }

  const exerciseName = 'fastread'
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [reading, setReading] = useState(false)
  const [readingSpeed, setReadingSpeed] = useState(0)
  const [teaseMessage, setTeaseMessage] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  const exerciseService = new ExerciseService()
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirm = () => {
    setIsConfirmed(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          day: dayNumber,
          token: token,
          exerciseName: exerciseName,
        }

        const response = await exerciseService.getExerciseData(data)

        if (response.status === 200) {
          setTitle(response.data[0].title[dayNumber - 1])
          setText(response.data[0].text[dayNumber - 1])
          setIsLoading(false)
        } else {
          console.error(response.data)
        }
      } catch (error) {
        console.error('İstek hatası:', error.response.data.error)
      }
    }
    fetchData()
  }, [])

  const exerciseOver = async () => {
    try {
      const data = {
        token: token,
        name: exerciseName,
      }
      const response = await exerciseService.setExerciseOver(data)
      if (response.status === 200) {
        console.log(response.data)
      } else {
        console.error(response.data)
      }
    } catch (error) {
      console.error('İstek hatası:', error.response.data.error)
    }
  }

  // metini bölme işlemini burada tanımlıyoruz çünkü apiden istek geldikten sonra yapılmasını istiyoruz
  const wordCount = text.split(' ').length

  const handleStart = () => {
    setStartTime(new Date())
    setReading(true)
    setEndTime(null) // Reset the end time when starting a new reading session
    setReadingSpeed(0) // Reset the reading speed when starting a new reading session
    setTeaseMessage('')
    setElapsedTime(0) // Reset the elapsed time
  }

  const handleStop = () => {
    const end = new Date()
    setEndTime(end)
    setReading(false)
    const durationInSeconds = elapsedTime
    const speed = (wordCount * 60) / durationInSeconds
    setReadingSpeed(speed)

    exerciseOver()

    // Tease the user if they finish reading in less than 10 seconds
    if (durationInSeconds <= 10) {
      setTeaseMessage('Sanırım metni okumayı unuttunuz ? 😄')
    }
  }

  const formatTime = (date) => {
    return date
      ? new Date(
          date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' })
        ).toLocaleTimeString()
      : ''
  }

  const formatElapsedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  useEffect(() => {
    let interval
    if (reading) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [reading])

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div>
      <header className="w-full flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">Hızlı Okuma Testi</h1>
      </header>
      <div className="flex p-4  mt-12">
        <div className="w-3/4 p-4 border h-96 overflow-y-scroll flex-row justify-center items-center rounded-xl shadow-xl">
          <p className="text-center font-bold text-xl">{title}</p>
          <p className="text-lg ">{text}</p>
        </div>
        <div className="w-76 p-4 h-60 border flex flex-col items-start rounded-xl shadow-xl absolute right-4">
          <p>Kelime Sayısı: {wordCount}</p>
          <p>Okumaya Başlama Saati: {formatTime(startTime)}</p>
          {endTime && <p>Okumayı Bitirme Saati: {formatTime(endTime)}</p>}
          <p>Geçen Süre: {formatElapsedTime(elapsedTime)}</p>
          <div className="mt-4">
            {!reading ? (
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-400"
              >
                Okumaya Başla
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-400"
              >
                Okumayı Bitir
              </button>
            )}
          </div>
          {endTime && (
            <div className="mt-4">
              <p>Okuma Hızınız: {readingSpeed.toFixed(2)} kelime/dakika</p>
              {teaseMessage && <p className="text-red-500">{teaseMessage}</p>}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="fixed inset-x-0 bottom-0">
        <footer className="w-full flex justify-center items-center p-4 bg-blue-300">
          <span className="text-white font-semibold">
            © 2024 Eleven. Tüm hakları saklıdır.
          </span>
        </footer>
      </div>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Hızlı Okuma Testi</h2>
            <p className="pb-2">
              Ekranda metin verilmiştir okumaya başla butonuna basarak okumaya
              başlayabilirsiniz. Metni okumayı bitirdiğinizde okumayı bitirdim
              butonuna basarak okuma hızınızı gözlemleyebilirsiniz.
            </p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={startScreen}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default FastRead
