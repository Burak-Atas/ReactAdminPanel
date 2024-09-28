import React, { useState, useEffect } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playFailSound } from '../../effect/Fail'
import { playInCorrectSound } from '../../effect/Incorrect'
import Header from '../Header'
import Footer from '../Footer'
import { CircleCheckBig, CircleX } from 'lucide-react'
import CountdownAnimation from '../../animation/CountdownAnimation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'


function GreenLight({dayNumber}) {

  const exerciseName = "greenlight";
  const [lenMatrix, setLenMatrix] = useState(4);
  const [matrix, setMatrix] = useState(
    Array(lenMatrix).fill(Array(lenMatrix).fill(null))
  )
  const [greenSquares, setGreenSquares] = useState([])
  const [greenSquaresCopy, setGreenSquaresCopy] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isStart, setIsStart] = useState(true)
  const [level, setLevel] = useState('Easy')
  const [attempts, setAttempts] = useState(3)
  const [clickedWrong, setClickedWrong] = useState(null)
  const [isClickable, setIsClickable] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [currentTable, setCurrentTable] = useState(1)
  const [totalTables, setTotalTables] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false)
  const [showTime, setShowTime] = useState(2000); // milliseconds

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
          setLevel(response.data[0].level[dayNumber-1]);
          setTotalTables(response.data[0].total_tables[dayNumber-1]);
          setShowTime(response.data[0].show_time[dayNumber-1]);
          setAttempts(response.data[0].attempts[dayNumber-1]);
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


  // Oyunu sıfırlama fonksiyonu
  const handleRestartGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setAttempts(3)
    setCorrectCount(0)
    setWrongCount(0)
    setCurrentTable(1)
    setIsStart(true)
    initializeGame()
  }

  // Oyunu başlatma veya yeni tablo oluşturma
  const initializeGame = () => {
    let size = 4
    let greenCount = 3
    if (level === 'Normal') {
      size = 6
      greenCount = 4
    } else if (level === 'Hard') {
      size = 8
      greenCount = 5
    }

    setLenMatrix(size)
    setMatrix(Array(size).fill(Array(size).fill(null)))

    const greenIndexes = []
    while (greenIndexes.length < greenCount) {
      const rowIndex = Math.floor(Math.random() * size)
      const colIndex = Math.floor(Math.random() * size)
      const index = `${rowIndex}-${colIndex}`
      if (!greenIndexes.includes(index)) {
        greenIndexes.push(index)
      }
    }

    setGreenSquares(greenIndexes)
    setGreenSquaresCopy([...greenIndexes])
    setClickedWrong(null)
    setIsClickable(false)
  }

  // Geri sayım animasyonunu başlat
  const startGame = () => {
    setShowCountdown(true)
  }

  // Geri sayım bittikten sonra yeşil kareleri göster ve gizle
  useEffect(() => {
    let timeoutId
    if (showCountdown) {
      timeoutId = setTimeout(() => {
        setShowCountdown(false)
        setTimeout(() => {
          setGreenSquares([])
          setIsClickable(true)
        }, showTime)
      }, 3000)
    }

    return () => clearTimeout(timeoutId)
  }, [showCountdown])

  // 'gameStarted' değeri değiştiğinde oyunu başlat
  useEffect(() => {
    if (gameStarted) {
      initializeGame()
      startGame()
    }
  }, [gameStarted])

  // Haklar bittiğinde veya tüm tablolar tamamlandığında kontrol et
  useEffect(() => {
    let timeoutId
    if (gameStarted && !gameOver) {
      if (attempts === 0) {
        playFailSound()
        setGreenSquares(greenSquaresCopy)
        setWrongCount(wrongCount + 1)

        timeoutId = setTimeout(() => {
          if (currentTable < totalTables) {
            setCurrentTable(currentTable + 1)
            setAttempts(3)
            initializeGame()
            startGame()
          } else {
            setGameOver(true);
            exerciseOver();
          }
        }, 2000)
      } else if (isClickable && greenSquaresCopy.length === 0) {
        playCorrectSound()

        // Tüm kareler doğruysa correctCount'u artır
        if (attempts > 0) {
          setCorrectCount(correctCount + 1)
        }

        timeoutId = setTimeout(() => {
          if (currentTable < totalTables) {
            setCurrentTable(currentTable + 1)
            setAttempts(3)
            initializeGame()
            startGame()
          } else {
            playCongrulationSound()
            setGameOver(true);
            exerciseOver();
          }
        }, 2000)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [
    attempts,
    greenSquaresCopy,
    gameStarted,
    gameOver,
    currentTable,
    isClickable,
  ])

  // Bir kareye tıklandığında kontrol et
  const handleClick = (rowIndex, colIndex) => {
    if (gameOver || !gameStarted || !isClickable) return

    const clickedIndex = `${rowIndex}-${colIndex}`
    if (greenSquaresCopy.includes(clickedIndex)) {
      setGreenSquaresCopy(
        greenSquaresCopy.filter((index) => index !== clickedIndex)
      )
      setMatrix(
        matrix.map((row, rIndex) =>
          row.map((col, cIndex) => {
            if (rIndex === rowIndex && cIndex === colIndex) {
              return 'green'
            }
            return col
          })
        )
      )
    } else {
      playInCorrectSound()
      setClickedWrong(clickedIndex)
      setTimeout(() => {
        setClickedWrong(null)
      }, 500)
      setAttempts(attempts - 1)
    }
  }

  // Oyunu başlat
  const handleStartGame = () => {
    setIsStart(false)
    setGameStarted(true)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }


  return (
    <div className="w-full h-screen flex flex-col items-center overflow-hidden">
      <Header title={'Hafıza Egzersizi'} />

      {/* Geri sayım animasyonunu göster */}
      {showCountdown && <CountdownAnimation />}

      {/* Oyun arayüzü */}
      {!isStart && !showCountdown && (
        <div className="flex mt-24 items-center justify-center h-3/4">
          {/* Oyun istatistikleri */}
          <div className="absolute top-0 right-0 mt-16 mr-8 p-4 w-40 flex flex-col justify-center items-center border-2 border-b-gray-100 rounded-md text-lg font-semibold">
            <span>Kalan Hak: {attempts}</span>
            <span>
              Tablo: {currentTable} / {totalTables}
            </span>
            <div className="flex-col p-2 justify-center items-center">
              <span className="flex gap-2 items-center">
                <CircleCheckBig size={20} color="#14cb1f" strokeWidth={1.75} />
                {correctCount}
              </span>
            </div>
            <div>
              <span className="flex gap-2 items-center">
                <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
                {wrongCount}
              </span>
            </div>
          </div>

          {/* Oyun matrisi */}
          <div>
            {matrix.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center justify-center">
                {row.map((col, colIndex) => {
                  const isGreen = greenSquares.includes(
                    `${rowIndex}-${colIndex}`
                  )
                  const isWrongClick =
                    clickedWrong === `${rowIndex}-${colIndex}`
                  const isShowCorrect = greenSquares.includes(
                    `${rowIndex}-${colIndex}`
                  )

                  return (
                    <div
                      key={colIndex}
                      className="w-16 h-16 border border-black text-center cursor-pointer transition-colors duration-300" // Geçiş efekti eklendi
                      style={{
                        backgroundColor: isShowCorrect // showCorrectSquares durumu kontrol ediliyor
                          ? 'green' // Eğer showCorrectSquares true ise yeşil yapılıyor
                          : isWrongClick
                          ? 'red'
                          : isGreen
                          ? 'green'
                          : col,
                      }}
                      onClick={() => handleClick(rowIndex, colIndex)}
                    ></div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />

      {/* Başlangıç ekranı */}
      {isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Hafıza Egzersizi</h2>
            <p className="pb-2">
              Egzersiz başında belli süre gösterilen yeşil kutucukları bulun.
            </p>

            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleStartGame}
            >
              Devam
            </button>
          </div>
        </div>
      )}

      {/* Oyun sonu ekranı */}
      {gameOver && (
        <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div
            className="bg-white p-8 rounded-md text-center"
            style={{ width: '300px' }}
          >
            <p style={{ fontSize: '20px' }}>
              Tebrikler! Egzersizi başarıyla tamamladınız.
            </p>
            <div>
              <p>Doğru: {correctCount}</p>
              <p>Yanlış: {wrongCount}</p>
            </div>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleRestartGame}
            >
              Tekrar Oyna
            </button>
            <button onClick={handleReturnDashboard} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default GreenLight
