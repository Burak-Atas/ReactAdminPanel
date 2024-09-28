import React, { useState, useEffect } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const Ikara = ({ dayNumber }) => {
  const exerciseName = 'ikara'
  const [isFinish, setIsFinish] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [remainingGames, setRemainingGames] = useState(2)
  const [numGame, setNumGame] = useState(2)
  const [counter, setCounter] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState('00:00')

  const [operation, setOperation] = useState({
    num1: Math.floor(Math.random() * 90 + 10),
    num2: Math.floor(Math.random() * 90 + 10),
    operator: '+',
    result: 0,
    extraDigits: [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)],
    positions: [],
  })

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const exerciseService = new ExerciseService()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const [totalRounds, setTotalRounds] = useState(3)

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
          setNumGame(response.data[0].num_games[dayNumber - 1])
          setTotalRounds(response.data[0].num_games[dayNumber - 1])
          setRemainingGames(response.data[0].num_games[dayNumber - 1])
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
    setStartTime(Date.now())
  }

  const generateNewGame = () => {
    let operator = Math.random() < 0.5 ? '+' : '-'
    let num1 = Math.floor(Math.random() * 90 + 10)
    let num2 = Math.floor(Math.random() * 90 + 10)
    let result = 0
    const temp = num2

    if (operator === '+') {
      result = num1 + num2
    }
    if (operator === '-') {
      if (num1 > num2) {
        result = num1 - num2
      } else {
        num2 = num1
        num1 = temp
        result = num1 - num2
      }
    }

    let extraDigits = [
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ]

    // Ensure the extra digits do not match the adjacent digits in num1 or num2
    while (extraDigits[0] === parseInt(num1.toString()[0])) {
      extraDigits[0] = Math.floor(Math.random() * 9)
    }

    while (extraDigits[1] === parseInt(num2.toString().slice(-1))) {
      extraDigits[1] = Math.floor(Math.random() * 9)
    }

    const positions = [
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2) + 3,
    ]

    setOperation({ num1, num2, operator, result, extraDigits, positions })
  }

  useEffect(() => {
    if (counter === 0 && isStart) {
      setStartTime(Date.now())
    }
    if (counter === numGame) {
      playCongrulationSound()
      setIsFinish(true)
      if (isFirst) {
        exerciseOver()
      }
      setIsFirst(false)
      setCounter(0)
      setStartTime(null)
    } else if (isStart) {
      generateNewGame()
    }

    const timer = setInterval(() => {
      if (!isFinish && startTime !== null && isStart) {
        const now = Date.now()
        const timePassed = Math.floor((now - startTime) / 1000) // Saniye cinsinden hesaplama
        const minutes = ('0' + Math.floor(timePassed / 60)).slice(-2) // Dakika iki haneli olarak
        const seconds = ('0' + (timePassed % 60)).slice(-2) // Saniye iki haneli olarak
        setElapsedTime(`${minutes}:${seconds}`) // Güncellenmiş elapsedTime değerini ayarla
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [counter, isFinish, numGame, startTime, isStart])

  const [selectedPositions, setSelectedPositions] = useState([])
  const [numClick, setNumClick] = useState(0)

  const togglePosition = (position) => {
    if (numClick < 2 || selectedPositions.includes(position)) {
      if (selectedPositions.includes(position)) {
        setSelectedPositions(selectedPositions.filter((p) => p !== position))
        setNumClick(numClick - 1)
      } else {
        setSelectedPositions([...selectedPositions, position])
        setNumClick(numClick + 1)
      }
    }
  }

  const checkAnswer = () => {
    const correctPositions = [
      operation.positions[0],
      operation.positions[1] + operation.num1.toString().length + 1,
    ]

    const allCorrect = correctPositions.every((pos) =>
      selectedPositions.includes(pos)
    )

    if (allCorrect && selectedPositions.length === correctPositions.length) {
      playCorrectSound()
      console.log('Oyun tamamlandı!')
      setCounter(counter + 1)
      setRemainingGames(remainingGames - 1)
      setSelectedPositions([])
      setNumClick(0)
    } else {
      playInCorrectSound()
      console.log('Yanlış kombinasyon.')
    }
  }

  const operationString = `${operation.num1}${operation.operator}${operation.num2}=${operation.result}`
  let operationArray = operationString.split('')

  if (operation.positions.length === 2) {
    operationArray.splice(
      operation.positions[0],
      0,
      operation.extraDigits[0].toString()
    )
    operationArray.splice(
      operation.positions[1] + operation.num1.toString().length + 1,
      0,
      operation.extraDigits[1].toString()
    )
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div>
      <header className="w-full fixed top-0 flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-4xl font-semibold text-white">İkara</h1>
      </header>

      <div className="fixed right-4 top-24 w-40 h-16 bg-blue-400 rounded-lg p-4 flex flex-col items-center justify-center">
        <div className="text-xl text-white">Süre: {elapsedTime}</div>
        <div className="text-xl text-white">
          Tur: {totalRounds - remainingGames}/{totalRounds}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex justify-center mb-4 text-4xl">
          {operationArray.map((digit, index) => (
            <div
              key={index}
              className={`w-16 h-16 flex justify-center items-center ${
                selectedPositions.includes(index) &&
                digit !== '=' &&
                digit !== '+' &&
                digit !== '-'
                  ? 'bg-white'
                  : 'bg-blue-300'
              } text-center cursor-pointer border-2 border-blue-500 rounded-lg m-1 ${
                digit === '=' || digit === '+' || digit === '-'
                  ? 'pointer-events-none'
                  : ''
              }`}
              onClick={() => togglePosition(index)}
            >
              {digit}
            </div>
          ))}
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded text-lg"
          onClick={checkAnswer}
        >
          Kontrol Et
        </button>
        {isFinish && (
          <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
            <div className="bg-white p-8 rounded-md text-center">
              <p className="text-2xl">Tebrikler! Alıştırmayı tamamlandınız.</p>
              <div>
                <p style={{ fontSize: '24px' }}>
                  Tamamlama Süreniz: {elapsedTime}
                </p>
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setIsFinish(false)
                    setCounter(0)
                    setStartTime(Date.now())
                    setRemainingGames(numGame)
                  }}
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
      </div>
      <footer className="w-full fixed bottom-0 flex justify-center items-center p-4 bg-blue-300">
        <span className="text-white font-semibold">
          ©️ 2024 Eleven. Tüm hakları saklıdır.
        </span>
      </footer>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">İkara Egzersizi</h2>
            <p className="pb-2">
              Verilen işlemin sonucunun doğuru olması için iki sayıyı üzerine
              tıklayarak siliniz ve eğer doğu olduğuna inanıyorsanız kontrol et
              butonuna tıklayınız
            </p>
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

export default Ikara
