import React, { useState, useEffect } from 'react'
import step from '../../effect/step.mp3'
import finishSound from '../../effect/congrulation.mp3'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Header from '../Header'
import Footer from '../Footer'

const GrowingSquare = ({ dayNumber }) => {
  const exerciseName = 'growingsquare'
  const [words, setWords] = useState([])
  const [currentWords, setCurrentWords] = useState(['', '', '', ''])
  const [rectangleSize, setRectangleSize] = useState({
    width: 200,
    height: 200,
  })
  const [wordIndex, setWordIndex] = useState(0)
  const [reset, setReset] = useState(false)
  const [resetCount, setResetCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [GreetingScreen, setGreetingScreen] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [speed, setSpeed] = useState(500)
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const exerciseService = new ExerciseService()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFirst, setIsFirst] = useState(true)

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
          console.log(response.data)
          setWords(response.data[0].texts[dayNumber - 1])
          setCurrentWords(response.data[0].texts[dayNumber - 1].slice(0, 4))
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

  const closeScreen = () => {
    setGreetingScreen(true)
  }

  useEffect(() => {
    let interval
    if (started && !isPaused) {
      interval = setInterval(() => {
        if (rectangleSize.width >= 1000) {
          setIsFinish(true)
          if (isFirst) {
            exerciseOver()
          }
          setIsFirst(false)
          clearInterval(interval)
        } else {
          new Audio(step).play()
          setRectangleSize((prevSize) => ({
            width: prevSize.width + 30,
            height: prevSize.height + 10,
          }))
          setWordIndex((prevIndex) => {
            const newIndex = prevIndex + 4
            return newIndex >= words.length ? 0 : newIndex
          })
        }
      }, speed)
    }

    return () => clearInterval(interval)
  }, [rectangleSize, started, isPaused, wordIndex, words])

  useEffect(() => {
    setCurrentWords(words.slice(wordIndex, wordIndex + 4))
  }, [wordIndex, words])

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleStart = () => {
    setStarted(true)
  }

  const handleReset = () => {
    setReset(false)
    setResetCount(0)
    setRectangleSize({ width: 200, height: 200 })
    setIsFinish(false)
    setStarted(false)
    setWordIndex(0) // Kelime indeksini sıfırla
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-between">
      <Header title={'Büyüyen Dikdörtgen'} />

      <div className="flex-grow flex justify-center items-center">
        <div
          className="outer-rectangle relative border-2 border-lightblue flex justify-center items-center bg-slate-100 rounded-xl"
          style={{
            width: `${rectangleSize.width}px`,
            height: `${rectangleSize.height}px`,
          }}
        >
          <div
            className="absolute font-bold text-blue text-lg "
            style={{ top: '-30px', left: '50%', transform: 'translateX(-50%)' }}
          >
            {currentWords[0]}
          </div>
          <div
            className="absolute font-bold text-blue text-lg"
            style={{
              top: '50%',
              right: '-90px',
              transform: 'translateY(-50%)',
            }}
          >
            {currentWords[1]}
          </div>
          <div
            className="absolute font-bold text-blue text-lg"
            style={{
              bottom: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {currentWords[2]}
          </div>
          <div
            className="absolute font-bold text-blue text-lg"
            style={{
              top: '50%',
              left: '-90px',
              transform: 'translateY(-50%)',
            }}
          >
            {currentWords[3]}
          </div>
          <div className="w-3 h-3 bg-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <div className="flex space-x-4 mb-12">
        {!started && (
          <button
            className="btn btn-start w-28 h-14 bg-blue-300 text-white rounded-xl text-xl hover:bg-blue-200"
            onClick={handleStart}
          >
            Başla
          </button>
        )}
        {started && !isPaused && (
          <button
            className="btn btn-pause w-28 h-14 bg-yellow-500 text-white  text-xl rounded-xl hover:bg-yellow-400"
            onClick={handlePause}
          >
            Durdur
          </button>
        )}
        {isPaused && (
          <button
            className="btn btn-resume w-28 h-14 bg-green-500 text-white  rounded-xl text-xl hover:bg-green-400"
            onClick={handleResume}
          >
            Devam Et
          </button>
        )}
      </div>
      <Footer />
      {!GreetingScreen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Büyüyen Dikdörtgen Egzersizi
            </h2>
            <p className="pb-2">
              Bu egzersizle görüş alanın genişleyecek. Ortadaki kırmzı noktaya
              bakarak uzaklaşan hece/kelimeleri görmeye çalışın.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={closeScreen}
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
            <button
              className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
              onClick={handleReset}
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
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default GrowingSquare
