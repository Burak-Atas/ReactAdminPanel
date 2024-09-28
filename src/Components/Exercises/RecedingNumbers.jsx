import React, { useState, useEffect } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playStepSound } from '../../effect/Step'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Footer from '../Footer'
import Header from '../Header'
const RecedingNumbers = ({ dayNumber }) => {
  const exerciseName = 'recedingnumbers'
  const [offset, setOffset] = useState(0)
  const [isStart, setIsStart] = useState(true) // Egzersiz ilk açıldığında başlama ekranı
  const [isFinish, setIsFinish] = useState(false) // Egzersiz bitiş ekranı
  const [elapsedTime, setElapsedTime] = useState({ minutes: 0, seconds: 0 }) // Geçen süre
  const [exerciseDuration, setExerciseDuration] = useState(30) // Egzersiz süresi (saniye cinsinden)
  const [speed, setSpeed] = useState(500)
  const maxOffsetY = 6 // Y ekseninde maksimum offset değeri
  const maxOffsetX = 10 // X ekseninde maksimum offset değeri

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
          setExerciseDuration(response.data[0].time[dayNumber - 1])
          setSpeed(response.data[0].speed[dayNumber - 1])
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
    if (!isStart) {
      const interval = setInterval(() => {
        setOffset((prevOffset) => {
          // Y eksenindeki daireler için maksimum offset değerine ulaşıldığında sıfırla
          if (prevOffset >= maxOffsetY) {
            return 0
          }
          // X eksenindeki daireler için maksimum offset değerine ulaşıldığında sıfırla
          if (prevOffset >= maxOffsetX) {
            return 0
          }
          return prevOffset + 1 // Offset değerini her saniye arttır
        })
      }, speed)

      // Zamanlayıcıyı başlat
      const timerInterval = setInterval(() => {
        setElapsedTime((prevElapsedTime) => {
          let seconds = prevElapsedTime.seconds + 1
          let minutes = prevElapsedTime.minutes
          if (seconds === 60) {
            seconds = 0
            minutes++
          }
          // Egzersiz süresi tamamlandığında kronometreyi durdur ve bitiş ekranını göster
          if (minutes * 60 + seconds >= exerciseDuration) {
            playCongrulationSound()
            clearInterval(interval)
            clearInterval(timerInterval)
            setIsFinish(true)
            if (isFirst) {
              exerciseOver()
            }
            setIsFirst(false)
          }
          return { minutes, seconds }
        })
        playStepSound()
      }, 1000)

      return () => {
        clearInterval(interval)
        clearInterval(timerInterval)
      }
    }
  }, [isStart, maxOffsetX, maxOffsetY, exerciseDuration])

  // Egzersizi başlatan fonksiyon
  const handleStart = () => {
    setIsStart(false) // Başlama ekranını kapat
    setExerciseDuration(exerciseDuration) // Egzersiz süresini ayarla
  }

  // Egzersizi tekrar başlatan fonksiyon
  const handleRepeat = () => {
    setOffset(0) // Offset değerini sıfırla
    setIsStart(true) // Başlama ekranını tekrar aç
    setIsFinish(false) // Bitiş ekranını kapat
    setElapsedTime({ minutes: 0, seconds: 0 }) // Zamanlayıcıyı sıfırla
  }

  // Her dairenin başlangıç pozisyonunu ve uzaklığını hesaplamak için bir fonksiyon
  const calculatePosition = (axis, direction) => {
    const start = direction * 3 // Başlangıç pozisyonu merkezden 3rem uzaklıkta
    let move
    if (axis === 'Y') {
      move = direction * Math.min(offset, maxOffsetY) * 2 // Y ekseninde maksimum offset değerini aşma
    } else {
      move = direction * Math.min(offset, maxOffsetX) * 4 // X ekseninde maksimum offset değerini aşma
    }
    const value = `${start + move}rem`
    return { transform: `translate${axis}(${value})` }
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex justify-center items-center relative h-screen">
      <div className="absolute top-0 w-full">
        <Header title={'Genişleyen Sayılar'} />
      </div>
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-blue-400 border-2 border-black flex justify-center items-center text-lg text-white font-normal">
          {Math.floor(Math.random() * 100) + 1}{' '}
        </div>
        <div
          style={calculatePosition('X', -1)}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-blue-400 border-2 border-black flex justify-center items-center text-lg text-white font-normal"
        >
          {Math.floor(Math.random() * 100) + 1}{' '}
        </div>
        <div
          style={calculatePosition('X', 1)}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-blue-400 border-2 border-black flex justify-center items-center text-lg text-white font-normal"
        >
          {Math.floor(Math.random() * 100) + 1}{' '}
        </div>
        <div
          style={calculatePosition('Y', -1)}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-blue-400 border-2 border-black flex justify-center items-center text-lg text-white font-normal"
        >
          {Math.floor(Math.random() * 100) + 1}{' '}
        </div>
        <div
          style={calculatePosition('Y', 1)}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-blue-400 border-2 border-black flex justify-center items-center text-lg text-white font-normal"
        >
          {Math.floor(Math.random() * 100) + 1}{' '}
        </div>
      </div>
      <Footer />
      {/* Zamanlayıcı */}
      <div className="w-16 h-10 absolute top-20 right-4 m-4 bg-blue-400 text-white p-1 rounded-xl flex justify-center items-center">
        {`${elapsedTime.minutes < 10 ? '0' : ''}${elapsedTime.minutes}:${
          elapsedTime.seconds < 10 ? '0' : ''
        }${elapsedTime.seconds}`}
      </div>
      {isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-2">
              Genişleyen Sayılar Egzersizi
            </h2>
            <p className="pb-2">
              Ekranda beliren sayıları takip ederek onların uzaklaşan
              hareketlerine ayak uydurmanızı sağlar. Hedefinizi koruyarak süreyi
              en iyi şekilde değerlendirin ve odaklanma yeteneklerinizi test
              edin.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleStart}
            >
              Başla
            </button>
          </div>
        </div>
      )}
      {isFinish && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler Alıştırmayı bitirdiniz!</p>
            <p></p>
            <button
              className="bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700"
              onClick={handleRepeat}
            >
              Tekrarla
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

export default RecedingNumbers
