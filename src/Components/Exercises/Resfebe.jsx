import React, { useEffect, useState, useRef } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playInCorrectSound } from '../../effect/Incorrect'
import { CircleCheckBig, CircleX } from 'lucide-react'

import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const Resfebe = ({ dayNumber }) => {
  const exerciseName = 'resfebe'
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isStart, setIsStart] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [isFinish, setIsFinish] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState(3)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerId = useRef(null)
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false)

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)
  const [examples, setExamples] = useState([])
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
          const images = response.data[0].img[dayNumber - 1]
          const answers = response.data[0].answers[dayNumber - 1]

          setExamples(
            images.map((imagePath, index) => ({
              image1: imagePath,
              response: answers[index],
            }))
          )

          setIsLoading(false)
        } else {
          console.error(response.data)
        }
      } catch (error) {
        console.error('İstek hatası:', error.response.data.error)
      }
    }
    fetchData()
  }, [dayNumber, token])

  useEffect(() => {
    if (isStart && !isFinish) {
      timerId.current = setInterval(() => {
        setElapsedSeconds((prevSeconds) => prevSeconds + 1)
      }, 1000)
    } else {
      clearInterval(timerId.current)
    }

    return () => clearInterval(timerId.current)
  }, [isStart, isFinish])

  const exerciseOver = async () => {
    try {
      const data = {
        token: token,
        dayNumber: dayNumber,
        name: exerciseName,
        time: elapsedSeconds,
        correct: correct,
        incorrect: incorrect,
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
    if (isFinish) {
      exerciseOver()
    }
  }, [correct, incorrect, isFinish])

  const handleStart = () => {
    setIsStart(true)
  }

  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [inputStyle, setInputStyle] = useState('')

  const handleInputChange = (event) => {
    setUserInput(event.target.value.toLowerCase())
  }

  const restartExercise = () => {
    setCurrentExampleIndex(0)
    setUserInput('')
    setIsFinish(false)
    setCorrect(0)
    setIncorrect(0)
    setRemainingAttempts(3)
    setElapsedSeconds(0)
  }

  const checkResponse = () => {
    setIsCheckingAnswer(true)

    if (userInput === examples[currentExampleIndex].response) {
      setIsAnimating(true)
      setFeedbackMessage('Doğru!')
      playCorrectSound()
      setInputStyle('correct')
      setCorrect(correct + 1)
      setTimeout(() => {
        setFeedbackMessage('')
        setInputStyle('')
        setIsAnimating(false)
        setIsCheckingAnswer(false)
        nextExample()
      }, 1000)
    } else {
      handleIncorrectAnswer()
    }
  }

  const handleIncorrectAnswer = () => {
    setIsCheckingAnswer(true)
    setRemainingAttempts((prevAttempts) => prevAttempts - 1)
    setInputStyle('incorrect')
    playInCorrectSound()

    if (remainingAttempts === 1) {
      setIncorrect(incorrect + 1)
      setTimeout(() => {
        setInputStyle('')
        setUserInput(examples[currentExampleIndex].response)
      }, 1000)
      setTimeout(() => {
        setFeedbackMessage('')
        setIsCheckingAnswer(false)
        nextExample()
      }, 3000)
    } else {
      setTimeout(() => {
        setInputStyle('')
        setUserInput('')
        setIsCheckingAnswer(false)
      }, 1000)
    }
  }

  const nextExample = () => {
    if (currentExampleIndex < examples.length - 1) {
      setCurrentExampleIndex(currentExampleIndex + 1)
      setRemainingAttempts(3)
      setUserInput('')
    } else {
      setIsFinish(true)
      playCongrulationSound()
    }
  }

  const passToNext = () => {
    if (isCheckingAnswer) return

    setIsCheckingAnswer(true)
    setIncorrect(incorrect + 1)
    setInputStyle('incorrect')
    playInCorrectSound()

    setUserInput(examples[currentExampleIndex].response)

    setTimeout(() => {
      setFeedbackMessage('')
      setInputStyle('')
      setIsCheckingAnswer(false)
      nextExample()
    }, 1000)
  }

  const renderExample = () => {
    const example = examples[currentExampleIndex]
    return (
      <div className="flex justify-center items-center h-full">
        {example.image1 && (
          <div className="relative text-center ">
            <img
              src={example.image1}
              alt="Resfebe"
              className="mx-auto pr-4"
              style={{ width: '90%', height: '90%' }}
            />
          </div>
        )}
      </div>
    )
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen overflow-hidden ">
      <div className=" flex  flex-col justify-center items-center ">
        <header className="w-full flex justify-center items-center p-4 bg-blue-300">
          <h1 className="text-3xl font-semibold text-white">Resfebe</h1>
        </header>
      </div>
      <div className="h-full relative bg-blue-200 ml-0 mr-0  mt-0 flex flex-col items-center justify-center">
        {isStart && (
          <div className="absolute top-4 right-4 font-semibold bg-white flex flex-col justify-center items-center rounded-md px-4 py-2">
            Süre: {formatTime(elapsedSeconds)}
            <div className="mb-4">Kalan Hak: {remainingAttempts}</div>
            <div className=" flex space-x-8">
              <span className="flex gap-2 items-center">
                <CircleCheckBig size={20} color="#14cb1f" strokeWidth={1.75} />
                {correct}
              </span>

              <span className="flex gap-2 items-center">
                <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
                {incorrect}
              </span>
            </div>
          </div>
        )}
        <div className="bg-white h-1/3 w-1/2 rounded-xl mb-20">
          {renderExample()}
        </div>

        <div className="mt-4 mb-16">
          <input
            value={userInput}
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-4 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              inputStyle === 'incorrect'
                ? 'bg-red-500'
                : inputStyle === 'correct'
                ? 'bg-green-500'
                : ''
            }`}
            id="response"
            type="text"
            placeholder="Cevap"
            disabled={
              !isStart ||
              isFinish ||
              remainingAttempts === 0 ||
              isCheckingAnswer
            }
            onKeyPress={(event) => {
              if (event.key === 'Enter' && !isCheckingAnswer) {
                checkResponse()
              }
            }}
          />
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          {isStart && !isFinish && (
            <button
              onClick={passToNext}
              className="bg-blue-300 text-xl text-white py-3 px-6 rounded-xl hover:bg-red-300"
              disabled={isCheckingAnswer}
            >
              Pas
            </button>
          )}
          {isStart && !isFinish && (
            <button
              onClick={checkResponse}
              className="bg-green-400 text-xl text-white py-2 px-4 rounded-xl hover:bg-green-300"
              disabled={isCheckingAnswer}
            >
              Kontrol Et
            </button>
          )}
        </div>
      </div>
      <footer className="w-full flex justify-center items-center p-4 bg-blue-300 absolute bottom-0 left-0">
        <span className="text-white font-semibold">
          © 2024 Eleven. Tüm hakları saklıdır.
        </span>
      </footer>
      {feedbackMessage && (
        <div className="fixed inset-0 flex items-center justify-center">
          <span
            className={`text-9xl font-bold animate-ping animate-once ${
              inputStyle === 'correct' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedbackMessage}
          </span>
        </div>
      )}
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Resfebe Egzersizi</h2>
            <p className="pb-2">
              Verilen görsel ve kelime/harflerden yararlanarak istenilen
              kelimeleri bulmaya yönelik zeka egzersizidir.
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
      {isFinish && (
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
            <p>Süre: {formatTime(elapsedSeconds)}</p>
            <button
              className="mt-4 bg-blue-300 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded"
              onClick={restartExercise}
            >
              Tekrar
            </button>
            <div>
              <button
                onClick={handleReturnDashboard}
                className="mt-4 bg-blue-300 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded"
              >
                Anasayfaya Dön
              </button>
            </div>
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default Resfebe
