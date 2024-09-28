import React, { useState, useEffect, useRef } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import Meyve from '../../assets/DifPic/Meyve.png'
import Meyve2 from '../../assets/DifPic/Meyve2.png'
import Meyve3 from '../../assets/DifPic/Meyve3.png'
import Meyve4 from '../../assets/cherry.jpeg'
import Meyve5 from '../../assets/lemnon.png'
import Meyve6 from '../../assets/grape.jpeg'
import Meyve7 from '../../assets/watermelon.jpeg'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const Peripheral2 = ({ dayNumber }) => {
  const exerciseName = 'peripheral'
  const [exerciseDurationSeconds, setExerciseDurationSeconds] = useState(10)
  const [imageDisplayTime, setImageDisplayTime] = useState(1000)
  const [positionChangeDelay, setPositionChangeDelay] = useState(300)
  const [isStarted, setIsStarted] = useState(false)
  const [targetImage, setTargetImage] = useState(null)
  const [targetCount, setTargetCount] = useState(0)
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState(
    exerciseDurationSeconds
  )
  const [startScreen, setStartScreen] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const intervalId = useRef(null)
  const countdownIntervalId = useRef(null)
  const images = [Meyve, Meyve2, Meyve3, Meyve4, Meyve5, Meyve6, Meyve7]
  const [answerResult, setAnswerResult] = useState(null)
  const positions = [
    { top: '10%', left: '2%' },
    { bottom: '10%', left: '2%' },
    { bottom: '10%', left: '90%' },
    { top: '10%', left: '90%' },
    { top: '10%', left: '2%' },
    { bottom: '10%', left: '2%' },
    { bottom: '10%', left: '90%' },
    { top: '10%', left: '90%' },

    { top: '10%', left: '2%' },
    { top: '45%', left: '2%' },
    { bottom: '10%', left: '2%' },
    { bottom: '10%', left: '45%' },
    { bottom: '10%', left: '90%' },
    { bottom: '45%', left: '90%' },
    { top: '10%', left: '90%' },
    { top: '10%', left: '45%' },
    { top: '10%', left: '2%' },

    { top: '10%', left: '2%' },
    { top: '10%', left: '90%' },
    { top: '45%', left: '2%' },
    { top: '45%', left: '90%' },
    { bottom: '10%', left: '2%' },
    { bottom: '10%', left: '90%' },
    { bottom: '10%', left: '2%' },
    { top: '45%', left: '90%' },
    { top: '45%', left: '2%' },
    { top: '10%', left: '90%' },
    { top: '10%', left: '2%' },
  ]

  const [isLoading, setIsLoading] = useState(true)
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [currentInterval, setCurrentInterval] = useState(1)

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
          setExerciseDurationSeconds(
            response.data[0].exercise_duration_second[dayNumber - 1]
          )
          setImageDisplayTime(
            response.data[0].image_display_time[dayNumber - 1]
          )
          setPositionChangeDelay(
            response.data[0].position_change_delay[dayNumber - 1]
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
      console.error('İstek hatası:', error.response.data.error)
    }
  }

  const handleScreen = () => {
    setStartScreen(true)
  }

  useEffect(() => {
    const randomTargetIndex = Math.floor(Math.random() * images.length)
    setTargetImage(images[randomTargetIndex])
  }, [])

  useEffect(() => {
    if (isStarted) {
      startInterval()
    }
  }, [isStarted])

  const startInterval = () => {
    let timeoutId
    let intervalDuration = exerciseDurationSeconds / 3

    let randomImageIndex = Math.floor(Math.random() * images.length)
    setCurrentImage(images[randomImageIndex])

    intervalId.current = setInterval(() => {
      timeoutId = setTimeout(() => {
        setCurrentPositionIndex(
          (prevIndex) => (prevIndex + 1) % positions.length
        )

        do {
          randomImageIndex = Math.floor(Math.random() * images.length)
        } while (images[randomImageIndex] === currentImage)
        setCurrentImage(images[randomImageIndex])
      }, positionChangeDelay)
    }, imageDisplayTime)

    countdownIntervalId.current = setInterval(() => {
      setRemainingSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(countdownIntervalId.current)
          clearInterval(intervalId.current)
          clearTimeout(timeoutId)
          handleIntervalEnd()
          return 0
        } else {
          return prevSeconds - 1
        }
      })
    }, 1000)

    return () => {
      clearInterval(intervalId.current)
      clearInterval(countdownIntervalId.current)
      clearTimeout(timeoutId)
    }
  }

  const handleIntervalEnd = () => {
    clearInterval(countdownIntervalId.current)
    setShowResult(true)
  }

  useEffect(() => {
    if (isStarted && currentImage === targetImage) {
      setTargetCount((prevCount) => prevCount + 1)
    }
  }, [currentPositionIndex, isStarted, currentImage, targetImage])

  const handleStart = () => {
    setIsStarted(true)
    setRemainingSeconds(exerciseDurationSeconds / 3)
  }

  const handleSubmitAnswer = () => {
    if (parseInt(userAnswer) === targetCount) {
      setAnswerResult('Doğru!')
    } else {
      setAnswerResult(`Yanlış. Doğru cevap: ${targetCount}`)
    }

    if (currentInterval < 3) {
      setTimeout(() => {
        setCurrentInterval(currentInterval + 1)
        setRemainingSeconds(exerciseDurationSeconds / 3)
        setUserAnswer('')
        setShowResult(false)
        startInterval()
        setAnswerResult('')
      }, 2000)
    } else {
      playCongrulationSound()
      setTimeout(() => {
        setIsFinish(true)
        exerciseOver()
      }, 2000)
    }
  }

  const handleRestart = () => {
    setIsStarted(false)
    setTargetImage(null)
    setTargetCount(0)
    setCurrentPositionIndex(0)
    setShowResult(false)
    setUserAnswer('')
    setIsFinish(false)
    setAnswerResult(null)
    setCurrentInterval(1)
    setRemainingSeconds(exerciseDurationSeconds)

    const randomTargetIndex = Math.floor(Math.random() * images.length)
    setTargetImage(images[randomTargetIndex])
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen w-full">
      <div className="absolute top-0 w-full">
        <Header title={'Periferik Görme'} />
      </div>

      {!isStarted && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center text-xl m4">
            <img src={targetImage} alt="" />
            <p>Bu resimden kaç defa gördüğünüzü takip ediniz.</p>
          </div>
          <button
            onClick={handleStart}
            className="bg-blue-300 mt-4 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded"
          >
            Başlat
          </button>
        </div>
      )}

      {isStarted && !showResult && (
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute top-0 left-0 p-4 text-white text-lg font-bold">
            Kalan Süre: {remainingSeconds}
          </div>
          {currentImage && (
            <img
              src={currentImage}
              alt="Meyve"
              className="absolute"
              style={{
                ...positions[currentPositionIndex],
                transition: 'all 0.2s ease-in-out',
              }}
            />
          )}
        </div>
      )}

      {showResult && (
        <div className="flex flex-col items-center justify-center h-full">
          <p>Hedef resim:</p>
          <img src={targetImage} alt="Hedef" className="w-32 h-32" />
          <p>Kaç defa gördünüz?</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="border border-gray-400 rounded px-3 py-2"
          />
          <button
            onClick={handleSubmitAnswer}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Cevabı Gönder
          </button>
          {answerResult && (
            <p className="mt-4 text-lg font-bold">{answerResult}</p>
          )}
        </div>
      )}

      <Footer />
      {!startScreen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Periferik Görme Egzersizi
            </h2>
            <p className="pb-2">
              Ekranda sizden istenen resmin sayısını takip edin ve her aralık
              sonunda çıkan soruyu cevaplayın.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleScreen}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      {isFinish && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p className="text-2xl">Tebrikler! Alıştırmayı tamamlandınız.</p>
            <div>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleRestart}
              >
                Tekrar
              </button>
              <div>
                <button
                  onClick={handleReturnDashboard}
                  className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                >
                  Ana Sayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!showResult && isStarted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full bg-black"
            style={{ width: '20px', height: '20px' }}
          >
            .
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default Peripheral2
