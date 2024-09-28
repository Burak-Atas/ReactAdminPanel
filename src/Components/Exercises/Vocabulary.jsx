import React, { useState, useEffect } from 'react'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const Vocabulary = ({ dayNumber }) => {
  const exerciseName = 'vocabulary'
  const [syllableCount, setSyllableCount] = useState('')
  const [words, setWords] = useState([])
  const [wordIndex, setWordIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(200)
  const [fontSize, setFontSize] = useState(14)

  const [text, setText] = useState('')

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

  useEffect(() => {
    setWords(text.split(' '))
  }, [text])

  useEffect(() => {
    let interval
    if (isRunning && wordIndex < words.length) {
      interval = setInterval(() => {
        setWordIndex((prevIndex) => prevIndex + 1)
      }, 60000 / speed)
    } else if (wordIndex >= words.length) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, speed, wordIndex, words.length])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setWordIndex(0)
  }

  const handleSyllableCountChange = (e) => setSyllableCount(e.target.value)

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen overflow-hidden">
      <header className="w-full flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">Kelime Hazinem</h1>
      </header>
      {/* Content */}
      <div className="p-4 mt-16 h-4/5">
        <div className="mb-4 flex items-center justify-center">
          <label className="mr-2">Kelime Türü Seçin:</label>
          <select
            value={syllableCount}
            onChange={handleSyllableCountChange}
            className="p-2 border"
          >
            <option value="">Seçiniz</option>
            <option value="1">1 Heceli</option>
            <option value="2">2 Heceli</option>
            <option value="3">3 Heceli</option>
            <option value="4">4 Heceli</option>
            <option value="5">5 Heceli</option>
            <option value="6">6 Heceli</option>
          </select>
        </div>
        <div className="mb-4 flex items-center justify-center">
          <label className="mr-2">Kelime Gösterim Hızı (kelime/dakika):</label>
          <input
            type="range"
            min="20"
            max="400"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="w-2/3"
          />
          <span>{speed}</span>
        </div>
        <div className="mb-4 flex items-center justify-center">
          <label className="mr-2">Kelime Boyutu:</label>
          <input
            type="range"
            min="16"
            max="140"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-1/3"
          />
          <span>{fontSize}px</span>
        </div>
        <div className="mb-4 flex justify-center">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="mr-2 p-2 bg-green-500 text-xl text-white rounded-xl hover:bg-green-300"
            >
              Başlat
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="mr-2 p-2 bg-yellow-500 text-xl rounded-xl text-white hover:bg-yellow-400"
            >
              Durdur
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-2 bg-red-500 text-white text-xl rounded-xl hover:bg-red-400"
          >
            Sıfırla
          </button>
        </div>
        <div className="text-center h-40 flex items-center justify-center bg-indigo-100">
          <span style={{ fontSize: `${fontSize}px` }}>
            {words[wordIndex] || 'Metni başlatın'}
          </span>
        </div>
        <div className="mt-4 flex-col justify-center items-center">
          <div className="h-2 bg-gray-300">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(wordIndex / words.length) * 100}%` }}
            ></div>
          </div>
          <span>{Math.round((wordIndex / words.length) * 100)}%</span>
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
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default Vocabulary
