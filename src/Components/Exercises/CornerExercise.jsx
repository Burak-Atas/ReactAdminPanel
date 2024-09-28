import React, { useState, useEffect } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import LoaderSimple from '../LoadPage/LoaderSimple'
import Header from '../Header'
import Footer from '../Footer'
const CornerExercise = ({ dayNumber }) => {

  const exerciseName = 'cornerexercise'
  const [level, setLevel] = useState('Hard')
  const [numberLeft, setNumberLeft] = useState('')
  const [numberRight, setNumberRight] = useState('')
  const [exerciseTime, setExerciseTime] = useState(5) // Egzersiz süresi (saniye)
  const [count, setCount] = useState(100) // değişme hızı
  const [isFinish, setIsFinish] = useState(false)
  const [exerciseStart, setExerciseStart] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [remainingTime, setRemainingTime] = useState(exerciseTime * 1000) // in milliseconds
  const [pauseTime, setPauseTime] = useState(null)

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
          setLevel(response.data[0].level[dayNumber - 1])
          setExerciseTime(response.data[0].exercise_time[dayNumber - 1])
          setCount(response.data[0].change_speed[dayNumber - 1])
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
        time: 0,
        correct: 0,
        incorrect: 0,
      }
      const response = await exerciseService.setExerciseOver(data)
      if (response.status === 200) {
        console.log(response.data)
      } else {
        console.error(response.data)
      }
    } catch (error) {
      console.error("İstek Hatası:", error);
      console.error("Hata Mesajı:", error.message);
      console.error("Hata Ayrıntıları:", error.response);
    }
  }

  useEffect(() => {
    let intervalId
    let timerId

    if (exerciseStart && !isFinish && !isPaused) {
      const generateRandomNumbers = () => {
        switch (level) {
          case 'Start':
            setNumberLeft(Math.floor(Math.random() * 10))
            setNumberRight(Math.floor(Math.random() * 10))
            break
          case 'Normal':
            setNumberLeft(Math.floor(Math.random() * 90 + 10))
            setNumberRight(Math.floor(Math.random() * 90 + 10))
            break
          case 'Little-Hard':
            setNumberLeft(Math.floor(Math.random() * 900 + 100))
            setNumberRight(Math.floor(Math.random() * 900 + 100))
            break
          case 'Hard':
            setNumberLeft(Math.floor(Math.random() * 9000 + 1000))
            setNumberRight(Math.floor(Math.random() * 9000 + 1000))
            break
          default:
            setNumberLeft('')
            setNumberRight('')
        }
      }

      const startExercise = () => {
        generateRandomNumbers()
        intervalId = setInterval(generateRandomNumbers, count)
      }

      const stopExercise = () => {
        clearInterval(intervalId)
        playCongrulationSound()
        setIsFinish(true)
        if (isFirst) {
          exerciseOver()
        }
        setIsFirst(false)
      }

      startExercise()
      timerId = setTimeout(stopExercise, remainingTime)

      return () => {
        clearInterval(intervalId)
        clearTimeout(timerId)
      }
    } else if (isPaused) {
      clearInterval(intervalId)
      clearTimeout(timerId)
    }
  }, [exerciseStart, level, count, isFinish, isPaused, remainingTime])

  const handleStartExercise = () => {
    if (exerciseStart) {
      if (isPaused) {
        setIsPaused(false)
        const timePaused = Date.now() - pauseTime
        setRemainingTime(remainingTime - timePaused)
      } else {
        setPauseTime(Date.now())
        setIsPaused(true)
      }
    } else {
      setExerciseStart(true)
      setPauseTime(null)
      setRemainingTime(exerciseTime * 1000)
    }
  }

  const handleResetExercise = () => {
    setExerciseStart(false)
    setIsPaused(false)
    setIsFinish(false)
    setNumberLeft('')
    setNumberRight('')
    setRemainingTime(exerciseTime * 1000)
  }

  const handleStart = () => {
    setIsStart(true)
  }

  const handleRepeatExercise = () => {
    setExerciseStart(false)
    setIsFinish(false)
    setRemainingTime(exerciseTime * 1000) // Reset remaining time to the initial exercise time
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen overflow-hidden">
      <Header title="Köşesel Egzersiz" />
      <Footer />
      <div className="flex-col h-5/6">
        <div className="flex flex-row justify-center h-5/6 items-center m-4 custom-div">
          <div
            className={
              'flex items-center justify-end text-custom-8xl h-4/5 w-4/5 border-8 border-blue-300'
            }
          >
            <span
              className={` ${level} fixed pr-custom-${
                level === 'Start'
                  ? '1'
                  : level === 'Normal'
                  ? '2'
                  : level === 'Little-Hard'
                  ? '3'
                  : '4'
              }`}
            >
              {numberLeft}
            </span>
          </div>
          <div
            className={
              'flex items-center justify-start text-custom-8xl h-4/5 w-4/5 border-8 custom-div border-blue-300'
            }
          >
            <span
              className={`${level} pl-custom-${
                level === 'Start'
                  ? '1'
                  : level === 'Normal'
                  ? '2'
                  : level === 'Little-Hard'
                  ? '3'
                  : '4'
              }`}
            >
              {numberRight}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <button
            className="text-2xl bg-blue-300 p-3 rounded-xl text-white hover:bg-blue-200"
            onClick={handleStartExercise}
          >
            {exerciseStart ? (isPaused ? 'Devam Et' : 'Durdur') : 'Başla'}
          </button>
          {exerciseStart && (
            <button
              className="text-2xl bg-red-300 p-3 rounded-xl text-white hover:bg-red-200"
              onClick={handleResetExercise}
            >
              Sıfırla
            </button>
          )}
        </div>
      </div>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Köşesel Egzersizi</h2>
            <p className="pb-2">
              Bu egzersiz ile görme alanınız genişleyecek. Ortadaki Çizgiye
              odaklanarak yanıp sönen sayıları görüp söylemelisin
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
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler! Alıştırmayı tamamlandınız.</p>
            <button
              onClick={handleReturnDashboard}
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
            >
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                onClick={handleRepeatExercise}
              >
                Tekrarla
              </button>
            </div>
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default CornerExercise
