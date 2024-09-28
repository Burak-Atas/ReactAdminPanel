import React, { useState, useEffect } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playStepSound } from '../../effect/Step'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const SameLetter = ({ dayNumber }) => {
  const exerciseName = 'sameletter'
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [correctList, setCorrectList] = useState([])
  const [incorrectList, setIncorrectList] = useState([])
  const [showingLetters, setShowingLetters] = useState(true)
  const [wordDisplayDuration, setWordDisplayDuration] = useState(500)
  const [isFinish, setIsFinish] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [letters, setLetters] = useState([
    { letter1: 'Çay', letter2: 'Demlik', same: true },
  ])

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

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
          setWordDisplayDuration(
            response.data[0].word_display_duration[dayNumber - 1]
          )
          setLetters(response.data[0].letters[dayNumber - 1])
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

  const handleStart = () => {
    setIsStart(true)
  }

  // Kelime gösterme ve yanıt süresi için tek bir useEffect
  useEffect(() => {
    let displayTimeout
    if (showingLetters && !isFinish && isStart) {
      playStepSound()
      displayTimeout = setTimeout(() => {
        setShowingLetters(false)
        handleIncorrectAnswer() // Kelimeler kaybolduğunda yanıtı otomatik yanlış işaretle
      }, wordDisplayDuration)
    }

    return () => clearTimeout(displayTimeout)
  }, [
    currentLetterIndex,
    showingLetters,
    wordDisplayDuration,
    isFinish,
    isStart,
  ])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [currentLetterIndex, isFinish, isStart])

  useEffect(() => {
    if (currentLetterIndex === letters.length && isStart) {
      setIsFinish(true)
      if (isFirst) {
        exerciseOver()
      }
      setIsFirst(false)
    }
  }, [currentLetterIndex, letters.length, isStart])

  const handleAnswer = (isCorrect) => {
    if (!isFinish) {
      if (isCorrect) {
        setCorrectList((prevList) => [...prevList, letters[currentLetterIndex]])
      } else {
        setIncorrectList((prevList) => [
          ...prevList,
          letters[currentLetterIndex],
        ])
      }
      if (currentLetterIndex === letters.length - 1) {
        setIsFinish(true)
        if (isFirst) {
          exerciseOver()
        }
        setIsFirst(false)
      } else {
        setCurrentLetterIndex((prevIndex) => prevIndex + 1)
        setShowingLetters(true)
      }
    }
  }

  const handleIncorrectAnswer = () => {
    if (!isFinish) {
      setIncorrectList((prevList) => [...prevList, letters[currentLetterIndex]])
      if (currentLetterIndex === letters.length - 1) {
        setIsFinish(true)
        if (isFirst) {
          exerciseOver()
        }
        setIsFirst(false)
      } else {
        setCurrentLetterIndex((prevIndex) => prevIndex + 1)
        setShowingLetters(true)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (isFinish) return

    if (e.key === 'ArrowRight' && letters[currentLetterIndex].same) {
      handleAnswer(true)
      playCorrectSound()
    } else if (e.key === 'ArrowLeft' && !letters[currentLetterIndex].same) {
      handleAnswer(true)
      playCorrectSound()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      handleIncorrectAnswer()
      playInCorrectSound()
    }
  }

  useEffect(() => {
    if (currentLetterIndex === letters.length) {
      setIsFinish(true)
      if (isFirst) {
        exerciseOver()
      }
      setIsFirst(false)
    }
  }, [currentLetterIndex, letters.length])

  const restartExercise = () => {
    setCurrentLetterIndex(0)
    setCorrectList([])
    setIncorrectList([])
    setShowingLetters(true)
    setIsFinish(false)
    setIsStart(false)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold rounded-xl text-white">
          Benzeri Bul
        </h1>
      </header>
      <div className="flex-grow flex">
        <div className="flex-grow flex justify-center items-center">
          <div className="flex justify-around items-center w-full max-w-2xl mx-auto">
            {showingLetters && !isFinish ? (
              <>
                <div className="text-2xl font-bold">
                  {letters[currentLetterIndex].letter1}
                </div>
                <div className="text-2xl font-bold">
                  {letters[currentLetterIndex].letter2}
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="w-1/5 flex flex-col justify-center items-center bg-gray-100">
          <div>
            <div className="mb-4 flex space-x-4 text-lg font-semibold">
              <h1 className="border-4 p-1 border-blue-300 cursor-pointer">
                {'<='} Sol Tuş (Benzer Değil)
              </h1>
              <h1 className="border-4 p-1 border-blue-300 cursor-pointer">
                Sağ Tuş (Benzer) {'=>'}
              </h1>
            </div>
            <div>
              <div className="mb-4 flex justify-center">
                <h2 className="text-lg font-semibold ">
                  Doğru: {correctList.length}
                </h2>
              </div>
              <div className="mb-4 flex justify-center">
                <h2 className="text-lg font-semibold">
                  Yanlış: {incorrectList.length}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="flex justify-center items-center p-4 bg-blue-300">
        <span className="text-white font-semibold">
          ©️ 2024 Eleven. Tüm hakları saklıdır.
        </span>
      </footer>

      {isFinish && (
        <div
          className={`bg-opacity-50 flex h-screen items-center justify-center fixed inset-0 ${
            incorrectList.length >= 3 ||
            incorrectList.length > correctList.length
              ? 'bg-red-400'
              : 'bg-gray-300'
          }`}
        >
          <div
            className="bg-white p-8 rounded-md text-center"
            style={{ width: '300px' }}
          >
            <p style={{ fontSize: '20px' }}>
              {incorrectList.length >= 3 ||
              incorrectList.length > correctList.length
                ? 'Üzgünüm,  egzersizi tamamlayamadınız.'
                : 'Tebrikler! Egzersizi başarıyla tamamladınız.'}
            </p>
            <div>
              <p>Doğru Yanıtlar:</p>
              <ul>
                {correctList.map((item, index) => (
                  <li key={index} style={{ color: 'green' }}>
                    {item.letter1} - {item.letter2}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p>Yanlış Yanıtlar:</p>
              <ul>
                {incorrectList.map((item, index) => (
                  <li key={index} style={{ color: 'red' }}>
                    {item.letter1} - {item.letter2}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={restartExercise}
            >
              Tekrar
            </button>
            <div>
              <button
                onClick={handleReturnDashboard}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Anasayfaya Dön
              </button>
            </div>
          </div>
        </div>
      )}

      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Benzeri Bul Egzersizi
            </h2>
            <p className="pb-2">
              Verilen kelimeler arasında benzerliklerini kıyaslayın
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleStart}
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

export default SameLetter
