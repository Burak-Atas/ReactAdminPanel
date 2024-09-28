import { React, useState, useEffect } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playInCorrectSound } from '../../effect/Incorrect'
import { playFailSound } from '../../effect/Fail'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Footer from '../Footer'
import Header from '../Header'

const FindMeaning = ({ dayNumber }) => {
  const exerciseName = 'findmeaning'
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState([''])
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
          setQuestions(response.data[0].questions[dayNumber - 1])
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [timer, setTimer] = useState(0) // Başlangıçta zamanlayıcı sıfır olacak
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0) // tam sayaç

  const handleStart = () => {
    setIsStart(true)
    setTimer(getInitialTimerValue())
  }

  const handleOptionClick = (option) => {
    setUserAnswer(option)
  }

  useEffect(() => {
    let interval
    if (isStart && !isFinish) {
      interval = setInterval(() => {
        setElapsedSeconds((prevSeconds) => prevSeconds + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStart, isFinish])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  const restartExercise = () => {
    setCurrentQuestionIndex(0)
    setCorrect(0)
    setIncorrect(0)
    setIsFinish(false)
    setIsStart(false)
    setTimer(getInitialTimerValue())
    setElapsedSeconds(0) // Sayaç sıfırla
  }

  const getInitialTimerValue = () => {
    // Seviyeye göre başlangıç zamanlayıcı değerini döndür
    switch (questions[currentQuestionIndex]?.level) {
      case 'Easy':
        return 7
      case 'Normal':
        return 5
      case 'Hard':
        return 4
      default:
        return 0
    }
  }

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      if (incorrect > 0) {
        setIsFinish(true)
        playFailSound()
      } else {
        setIsFinish(true)
        playCongrulationSound()
        if (isFirst) {
          exerciseOver()
        }
        setIsFirst(false)
      }
    }
  }, [currentQuestionIndex])

  // Zamanlayıcıyı yönetmek için useEffect
  useEffect(() => {
    let intervalId

    if (isStart && !isFinish && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else {
      clearInterval(intervalId)
    }

    // Zamanlayıcı sıfır olduğunda
    if (timer === 0 && isStart && !isFinish) {
      setIncorrect((prevIncorrect) => prevIncorrect + 1)
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setUserAnswer('')
      setTimer(getInitialTimerValue()) // Süre bittiğinde başlangıç süresine dön
    }

    // Temizleme fonksiyonu
    return () => clearInterval(intervalId)
  }, [isStart, isFinish, timer])

  useEffect(() => {
    if (userAnswer !== '') {
      if (userAnswer === questions[currentQuestionIndex].response) {
        playCorrectSound()
        setCorrect((prevCorrect) => prevCorrect + 1)
      } else {
        playInCorrectSound()
        setIncorrect((prevIncorrect) => prevIncorrect + 1)
      }

      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setUserAnswer('')
      setTimer(getInitialTimerValue()) // Yeni soruya geçildiğinde süreyi ayarla
    }
  }, [userAnswer]) // Kullanıcı cevap verdiğinde çalışır.

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="overflow-hidden h-screen flex justify-center items-center">
      <header className="w-full flex justify-center fixed top-0  items-center p-1 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">Anlam Bilgisi</h1>
      </header>
      <div className="flex flex-col items-center justify-center h-3/4 w-3/4">
        {/* Centered "Anlam" text */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">
            {questions[currentQuestionIndex]?.definition}
          </h1>
          <div>
            {questions[currentQuestionIndex]?.options.map((option, index) => (
              <button
                key={index}
                className="bg-blue-300 text-xl text-white py-2 px-4 mr-4 mt-4 mb-2 rounded hover:bg-blue-200"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Doğru ve Yanlış Sayılarının Bulunduğu Bölüm */}
      <div className="w-1/5 h-full flex flex-col justify-center -z-10 items-center fixed right-0 top-0 bg-gray-100">
        <div>
          <div className="mb-4 flex justify-center">
            <h2 className="text-lg font-semibold">Doğru: {correct}</h2>
          </div>
          <div className="mb-4 flex justify-center">
            <h2 className="text-lg font-semibold">Yanlış: {incorrect} </h2>
          </div>
          <div className="mb-4 flex justify-center">
            <h2 className="text-lg font-semibold">Kalan Süre: {timer}</h2>
          </div>
        </div>
      </div>
      <Footer />
      {isFinish && (
        <div>
          <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
            <div
              className="bg-white p-8 rounded-md text-center"
              style={{ width: '300px' }}
            >
              <p style={{ fontSize: '20px' }}>
                Tebrikler! Egzersizi tamamladınız.
              </p>
              <p>Doğru: {correct}</p>
              <p>Yanlış: {incorrect}</p>
              <p>Geçen Süre: {formatTime(elapsedSeconds)}</p>
              <button
                className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
                onClick={restartExercise}
              >
                Tekrar
              </button>
              <div>
                <button
                  onClick={handleReturnDashboard}
                  className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
                >
                  Anasayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Anlamını Bul Egzersizi
            </h2>
            <p className="pb-2">Anlamı verilen kelimeyi bulma egzersizi.</p>
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

export default FindMeaning
