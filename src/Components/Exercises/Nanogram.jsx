import React, { useState, useEffect, useRef } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const Nanogram = ({ dayNumber }) => {
  const exerciseName = 'nanogram'
  const [isFinish, setIsFinish] = useState(false)
  const [gridSize, setGridSize] = useState(5)
  const [matrix, setMatrix] = useState([])
  const [solutionMatrix, setSolutionMatrix] = useState([])
  const [rowHints, setRowHints] = useState([])
  const [colHints, setColHints] = useState([])
  const [isStart, setIsStart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFirst, setIsFirst] = useState(true)

  const [totalRounds, setTotalRounds] = useState(3)
  const [currentRound, setCurrentRound] = useState(1)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerId = useRef(null)

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')

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
          setGridSize(response.data[0].matrix[dayNumber - 1])
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
    // Süreyi başlat
    timerId.current = setInterval(() => {
      setElapsedSeconds((prevSeconds) => prevSeconds + 1)
    }, 1000)
  }

  // Rastgele çözüm matrisi oluşturma fonksiyonu
  const generateSolutionMatrix = (size) => {
    const newMatrix = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0)
    )

    for (let i = 0; i < size; i++) {
      let randomRow = Math.floor(Math.random() * size)
      let randomCol = Math.floor(Math.random() * size)
      newMatrix[i][randomCol] = 1
      newMatrix[randomRow][i] = 1
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newMatrix[i][j] === 0) {
          newMatrix[i][j] = Math.round(Math.random())
        }
      }
    }

    return newMatrix
  }

  // Satır ve sütun ipuçlarını hesaplama fonksiyonu
  const generateHints = (matrix) => {
    const rowHints = []
    const colHints = []

    for (let i = 0; i < matrix.length; i++) {
      let currentRowHint = []
      let currentColHint = []
      let count = 0

      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          count++
        } else if (count > 0) {
          currentRowHint.push(count)
          count = 0
        }
      }
      if (count > 0) {
        currentRowHint.push(count)
      }
      rowHints.push(currentRowHint)

      count = 0
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[j][i] === 1) {
          count++
        } else if (count > 0) {
          currentColHint.push(count)
          count = 0
        }
      }
      if (count > 0) {
        currentColHint.push(count)
      }
      colHints.push(currentColHint)
    }

    return [rowHints, colHints]
  }

  // Oyunu başlatma fonksiyonu
  const initializeGame = (size) => {
    const newSolutionMatrix = generateSolutionMatrix(size)
    const [newrowHints, newColHints] = generateHints(newSolutionMatrix)

    setSolutionMatrix(newSolutionMatrix)
    setRowHints(newrowHints)
    setColHints(newColHints)
    setMatrix(
      Array.from({ length: size }, () => Array.from({ length: size }, () => 0))
    )
    setIsFinish(false)
  }

  // Hücre tıklama fonksiyonu
  const toggleCell = (rowIndex, colIndex) => {
    const newMatrix = [...matrix]
    newMatrix[rowIndex][colIndex] = newMatrix[rowIndex][colIndex] ? 0 : 1
    setMatrix(newMatrix)
  }

  // Matrisleri karşılaştırma fonksiyonu
  const checkMatricesEquality = () => {
    if (matrix.length === 0 || solutionMatrix.length === 0) {
      return false
    }

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] !== solutionMatrix[i][j]) {
          return false
        }
      }
    }
    return true
  }

  // Oyunu sıfırlama fonksiyonu (Yeni oyun başlatmak için)
  const resetMatrix = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1)
      initializeGame(gridSize)
    } else {
      // Son tur tamamlandı, bitiş ekranını göster
      setIsFinish(true)
      exerciseOver()
      // Süreyi durdur
      clearInterval(timerId.current)
    }
  }

  useEffect(() => {
    initializeGame(gridSize)
  }, [gridSize])

  // Her matris güncellendiğinde kontrol et
  useEffect(() => {
    if (checkMatricesEquality()) {
      playCongrulationSound()

      // Eğer son tur değilse yeni turu başlat
      if (currentRound < totalRounds) {
        setTimeout(() => {
          resetMatrix()
        }, 1000)
      } else {
        // Son tur ise bitiş ekranını göster
        setIsFinish(true)
        exerciseOver()
        // Süreyi durdur
        clearInterval(timerId.current)
      }
    }
  }, [matrix, solutionMatrix])

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  // Süreyi dakika ve saniye cinsinden formatla
  const formattedTime = () => {
    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div>
      <div className="h-screen overflow-hidden flex flex-col items-center justify-between">
        <header className="w-full flex justify-center items-center p-4 bg-blue-300">
          <h1 className="text-3xl font-semibold text-white">Nanogram</h1>
        </header>
        <div className="fixed right-4 top-24 w-40 h-16 bg-blue-400 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-xl text-white">Süre: {formattedTime()}</div>
          <div className="text-xl text-white">
            Tur: {currentRound}/{totalRounds}
          </div>
        </div>
        <div>
          <table className="table-fixed border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="w-16 h-16 border border-gray-400"></th>
                {colHints.map((hints, colIndex) => (
                  <th key={colIndex} className="border border-gray-400">
                    <div className="flex flex-col items-center justify-center w-16">
                      {hints.map((hint, hintIndex) => (
                        <span key={hintIndex} className="text-xs my-1">
                          {hint}
                        </span>
                      ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th className="w-16 h-16 border border-gray-400">
                    <div className="flex flex-row items-center justify-center h-full">
                      {rowHints[rowIndex].map((hint, hintIndex) => (
                        <span key={hintIndex} className="text-xs mx-1">
                          {hint}
                        </span>
                      ))}
                    </div>
                  </th>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border border-gray-400 w-16 h-16 cursor-pointer ${
                        cell ? 'bg-dashboard' : 'bg-white'
                      }`}
                      onClick={() => toggleCell(rowIndex, colIndex)}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="w-full flex justify-center items-center p-4 bg-blue-300">
          <span className="text-white font-semibold">
            ©️ 2024 Eleven. Tüm hakları saklıdır.
          </span>
        </footer>
      </div>

      {/* Oyun bittiğinde gösterilecek ekran */}
      {isFinish && (
        <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div
            className="bg-white p-8 rounded-md text-center"
            style={{ width: '300px' }}
          >
            <p style={{ fontSize: '20px' }}>
              Tebrikler! Egzersizi tamamladınız.
              <p>Süreniz: {formattedTime()}</p>
            </p>
            <button
              onClick={handleReturnDashboard}
              className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
            >
              Anasayfaya Dön
            </button>
          </div>
        </div>
      )}
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Nanogram</h2>
            <p className="pb-2">
              Her satırın ve sütunun üzerinde yazan sayılara göre matris
              alandaki kutucukları doğru şekilde doldurunuz
            </p>
            <p className="pb-2">
              Örneğin eğer ilk satırda 1 3 sayıları varsa bu 1 tane alan
              doldurulmuş ve ondan sonra da arasında minimum 1 boşluk bulunacak
              şekilde birleşik 3 doldurulması gereken karo sayısını ifade eder
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

export default Nanogram
