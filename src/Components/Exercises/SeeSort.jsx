import React, { useState, useEffect, useRef } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playInCorrectSound } from '../../effect/Incorrect'
import LoaderSimple from '../LoadPage/LoaderSimple'
import ExerciseService from '../../services/ExerciseService'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Header from '../Header'
import Footer from '../Footer'

const SeeSort = ({ dayNumber }) => {
  const exerciseName = 'seesort'
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState([])
  const [shuffledLetters, setShuffledLetters] = useState([])
  const [timeLeft, setTimeLeft] = useState(10)
  const [showRedBorder, setShowRedBorder] = useState(false)
  const [words, setWords] = useState([])
  const timerId = useRef(null)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [stepTime, setStepTime] = useState(10)
  const [exerciseTime, setExerciseTime] = useState({
    minutes: 0,
    seconds: 0,
  }) // Sayaç için state
  const exerciseTimerId = useRef(null)

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
          setWords(response.data[0].words[dayNumber - 1])
          setStepTime(response.data[0].time[dayNumber - 1])
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
        dayNumber: dayNumber,
        name: exerciseName,
        time: (exerciseTime.minutes * 60) + exerciseTime.seconds,
        correct: 0,
        incorrect: 0,
      };
      const response = await exerciseService.setExerciseOver(data);
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error("İstek hatası:", error.response.data.error);
    }
  };

  useEffect(() => {
    if (isStart && timeLeft > 0) {
      timerId.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimeUp()
    }

    return () => clearTimeout(timerId.current)
  }, [isStart, timeLeft])

  // Egzersiz süresi için useEffect
  useEffect(() => {
    if (isStart && !isFinish) {
      exerciseTimerId.current = setInterval(() => {
        setExerciseTime((prevTime) => {
          let newSeconds = prevTime.seconds + 1
          let newMinutes = prevTime.minutes
          if (newSeconds >= 60) {
            newSeconds = 0
            newMinutes++
          }
          return { minutes: newMinutes, seconds: newSeconds }
        })
      }, 1000)
    } else {
      clearInterval(exerciseTimerId.current)
    }

    return () => clearInterval(exerciseTimerId.current)
  }, [isStart])

  const handleStart = () => {
    setIsStart(true)
    shuffleLetters()
    setUserInput(Array(words[currentWordIndex].letter.length).fill(''))
    setExerciseTime({ minutes: 0, seconds: 0 }) // Egzersiz başlangıcında sayacı sıfırla
  }

  useEffect(() => {
    if (isStart) {
      shuffleLetters() // Yeni kelime yüklendiğinde harfleri karıştır
      setUserInput(Array(words[currentWordIndex].letter.length).fill(''))
      setTimeLeft(stepTime)
    }
  }, [currentWordIndex, isStart])

  const restartExercise = () => {
    setIsFinish(false)
    setIsStart(false)
    setCurrentWordIndex(0)
    setTimeLeft(stepTime)
    setShowRedBorder(false)
    clearTimeout(timerId.current)
    setIsChecking(false)
    setExerciseTime({ minutes: 0, seconds: 0 }) // Egzersiz süresini sıfırla
  }

  const handleTimeUp = () => {
    const correctLetterCount = userInput.filter(
      (letter, index) => letter === words[currentWordIndex].letter[index]
    ).length

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== words[currentWordIndex].letter[i]) {
        userInput[i] = ''
      }
    }

    if (correctLetterCount === words[currentWordIndex].letter.length - 1) {
      userInput[userInput.findIndex((letter) => letter === '')] =
        words[currentWordIndex].letter[
          words[currentWordIndex].letter.length - 1
        ]
      handleCheck()
    } else if (
      correctLetterCount ===
      words[currentWordIndex].letter.length - 3
    ) {
      for (let i = 0; i < words[currentWordIndex].letter.length; i++) {
        if (userInput[i] === '') {
          userInput[i] = words[currentWordIndex].letter[i]
        }
      }
      handleCheck()
    } else {
      if (correctLetterCount < words[currentWordIndex].letter.length) {
        const emptyIndex = userInput.findIndex((letter) => letter === '')
        if (emptyIndex !== -1) {
          userInput[emptyIndex] = words[currentWordIndex].letter[emptyIndex]
        }
        if (correctLetterCount === words[currentWordIndex].letter.length - 2) {
          setTimeLeft(stepTime)
        } else {
          setTimeLeft(stepTime)
        }
      } else {
        handleCheck()
      }
    }

    setUserInput([...userInput])
  }

  const shuffleLetters = () => {
    const letters = words[currentWordIndex].letter.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    setShuffledLetters(letters)
  }

  const handleLetterClick = (letter) => {
    const emptyIndex = userInput.findIndex((l) => l === '')
    if (emptyIndex !== -1) {
      const updatedUserInput = [...userInput]
      updatedUserInput[emptyIndex] = letter
      setUserInput(updatedUserInput)
    }
  }

  const handleLetterRemove = (index) => {
    const updatedUserInput = [...userInput]
    updatedUserInput[index] = ''
    setUserInput(updatedUserInput)
  }

  const handleCheck = () => {
    setIsChecking(true)
    setShowRedBorder(userInput.join('') !== words[currentWordIndex].letter)
    if (userInput.join('') === words[currentWordIndex].letter) {
      playCorrectSound()
      clearTimeout(timerId.current)
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1)
          setUserInput(
            Array(words[currentWordIndex + 1].letter.length).fill('')
          )
          shuffleLetters()
          setTimeLeft(stepTime)
          setIsChecking(false)
          setShowRedBorder(false)
        } else {
          playCongrulationSound()
          setIsFinish(true)
          clearInterval(exerciseTimerId.current)

          if (isFirst) {
            exerciseOver()
          }
          setIsFirst(false)
        }
      }, 1000)
    } else {
      setTimeout(() => {
        setIsChecking(false)
      }, 1000)
    }
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="w-full h-screen">
      <Header title={'Karışık Harfler'} />
      <Footer />
      <div className="absolute top-0 right-0 font-semibold rounded-md px-4 py-2">
        <div className=" flex flex-col space-x-8 w-52 mt-24 mr-12 p-2 border-2 border-gray-300 justify-center items-center">
          <span>
            {' '}
            Geçen Süre: {exerciseTime.minutes}:
            {exerciseTime.seconds.toString().padStart(2, '0')}
          </span>
          {/* <span className="flex gap-2 items-center">
            <CircleCheckBig size={20} color="#14cb1f" strokeWidth={1.75} />
            {correct}
          </span>
          <span className="flex gap-2 items-center">
            <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
            {incorrect}
          </span> */}
        </div>
      </div>
      <div className="container mx-auto p-4 mt-60">
        {isStart && (
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="mb-4">
              <p className="text-lg font-semibold">
                <strong>İpucu:</strong> {words[currentWordIndex].definition}
              </p>
            </div>
            <div className="flex gap-2 mb-4">
              {Array(words[currentWordIndex].letter.length)
                .fill('')
                .map((_, index) => (
                  <div
                    key={index}
                    className={`border ${
                      userInput[index] === words[currentWordIndex].letter[index]
                        ? 'border-green-500'
                        : showRedBorder
                        ? 'border-red-500'
                        : 'border-gray-400'
                    } w-12 h-12 flex items-center justify-center text-lg font-semibold rounded cursor-pointer ${
                      userInput[index] !== '' ? 'bg-green-500 text-white' : ''
                    }`}
                    onClick={() => handleLetterRemove(index)}
                  >
                    {userInput[index]}
                  </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {shuffledLetters.map((letter, index) => (
                <button
                  key={index}
                  className="bg-blue-400 text-white py-2 px-4 w-12 h-12 rounded hover:bg-blue-300"
                  onClick={() => handleLetterClick(letter)}
                  disabled={
                    userInput.includes(letter) &&
                    userInput.filter((l) => l === letter).length >=
                      words[currentWordIndex].letter
                        .split('')
                        .filter((l) => l === letter).length
                  }
                >
                  {letter}
                </button>
              ))}
            </div>
            {isStart && !isChecking && (
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400"
                  onClick={handleCheck}
                >
                  Kontrol Et
                </button>
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <p className="text-gray-600">Kalan Süre: {timeLeft}</p>
            </div>
          </div>
        )}
      </div>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center">
            <h1 className="font-semibold text-2xl p-1">
              Karışık Harfler Egzersizi
            </h1>
            <p>
              Kelime hazneni test edeceğin bir egzersiz ile karşındayız. Karışık
              harflerden doğru kelimeyi bulmaya çalışmalısın. Sana verilen
              ipuçlarından faydalanmayı unutma!
            </p>
            <button
              className="bg-blue-400 text-xl text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleStart}
            >
              Başla
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
              Tebrikler! Gör Sırala Egzersizini tamamladınız.
            </p>
            <p>
              Toplam Süre: {exerciseTime.minutes}:
              {exerciseTime.seconds.toString().padStart(2, '0')}{' '}
            </p>
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
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default SeeSort
