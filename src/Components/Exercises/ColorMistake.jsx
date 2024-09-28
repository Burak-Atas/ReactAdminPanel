import React, { useEffect, useState, useRef } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playCorrectSound } from '../../effect/Correct'
import { trueColors, falseColors } from '../../constants'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Header from '../Header'
import Footer from '../Footer'

const ColorMismatchGame = ({ dayNumber }) => {
  const exerciseName = 'colormistake'
  const [sizeX, setSizeX] = useState(5)
  const [sizeY, setSizeY] = useState(8)
  const [randomMatrix, setRandomMatrix] = useState([])
  const [falseArray, setFalseArray] = useState([])
  const [selectedFalseColors, setSelectedFalseColors] = useState([])
  const [allColorsFound, setAllColorsFound] = useState(false)
  const [isStart, setIsStart] = useState(true)
  const [isFinish, setIsFinish] = useState(false)
  const [falseLimit, setFalseLimit] = useState(6)
  const [step, setStep] = useState(1) // Adım sayısı
  const [elapsedTime, setElapsedTime] = useState(0) // Geçen süre (saniye)
  const timerId = useRef(null)

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const exerciseService = new ExerciseService()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    let intervalId
    if (!isStart && !isFinish) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(intervalId)
    }

    return () => clearInterval(intervalId)
  }, [isStart, isFinish])

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
          setFalseLimit(response.data[0].false_limit[dayNumber - 1])
          setSizeX(response.data[0].matrix[dayNumber - 1][0])
          setSizeY(response.data[0].matrix[dayNumber - 1][1])
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
        time: elapsedTime,
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

  useEffect(() => {
    if (!isStart) {
      generateRandomMatrix()
    }
  }, [sizeX, sizeY, isStart, step])

  const generateRandomMatrix = () => {
    let i = 0
    let falseCount = 0
    const tempFalseArray = []
    const tempFalseColors = [...falseColors]
    const randomMatrix = Array.from({ length: sizeX }, () =>
      Array.from({ length: sizeY }, () => {
        const randomIndex = Math.floor(Math.random() * 2)
        if (i <= (sizeX * sizeY) / 2) {
          if (randomIndex === 0 || falseCount >= falseLimit) {
            const trueColorslen = Math.floor(Math.random() * trueColors.length)
            return { ...trueColors[trueColorslen], border: false }
          } else {
            i++
            if (tempFalseColors.length > 0 && falseCount < falseLimit) {
              const index = Math.floor(Math.random() * tempFalseColors.length)
              const selectedColor = tempFalseColors.splice(index, 1)[0]
              tempFalseArray.push(selectedColor)
              falseCount++
              return { ...selectedColor, border: false }
            }
          }
        }
        return { ...trueColors[randomIndex], border: false }
      })
    )
    setFalseArray(tempFalseArray)
    setRandomMatrix(randomMatrix)
    setSelectedFalseColors([])
    setAllColorsFound(false)
  }

  const handleColorsClick = (color) => {
    if (falseArray.find((item) => item.id === color.id)) {
      const updatedFalseArray = falseArray.filter(
        (item) => item.id !== color.id
      )
      setFalseArray(updatedFalseArray)
      playCorrectSound()
      setSelectedFalseColors((prev) => [...prev, color])
      const updatedMatrix = randomMatrix.map((row) =>
        row.map((col) => (col.id === color.id ? { ...col, border: true } : col))
      )
      setRandomMatrix(updatedMatrix)
      if (updatedFalseArray.length === 0) {
        setAllColorsFound(true)
        playCongrulationSound()
        if (step < 3) {
          setStep((prevStep) => prevStep + 1)
          setAllColorsFound(false) // Sonraki adıma geçerken allColorsFound'u sıfırla
        } else {
          setIsFinish(true)
          if (isFirst) {
            exerciseOver()
          }
          setIsFirst(false)
          setIsStart(false)
        }
      }
    }
  }

  const handleStart = () => {
    setIsStart(false)
    generateRandomMatrix()
  }

  const restartExercise = () => {
    setStep(1) // Adımı başa sar
    setElapsedTime(0) // Süreyi sıfırla
    generateRandomMatrix()
    setIsFinish(false)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  const renderColors = () => {
    return randomMatrix.map((row, rowIndex) => (
      <div key={rowIndex} className="flex flex-wrap">
        {row.map((color, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="w-36 h-16 flex items-center justify-center border border-transparent hover:border-black cursor-pointer m-1"
            style={{
              color: color.color,
              border: color.border ? '2px solid blue' : 'none',
              fontSize: '12px',
            }}
            onClick={() => handleColorsClick(color)}
          >
            <p
              className="font-bold w-36 text-center"
              style={{ fontSize: '22px' }}
            >
              {color.name.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    ))
  }

  const selectedFalseColorsCount = selectedFalseColors.length
  const remainingFalseColorsCount = falseArray.length
  const totalFalseColorsCount =
    selectedFalseColorsCount + remainingFalseColorsCount
  const falseColorsPercentage =
    totalFalseColorsCount > 0
      ? ((remainingFalseColorsCount / totalFalseColorsCount) * 100).toFixed(2)
      : 0

  // Süreyi dakika ve saniye cinsinden formatla
  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  return (
    <div className="container_mismatch flex flex-col h-screen relative">
      <Header title={'Renk Egzersizi'} />

      {!isStart && (
        <div className="info absolute top-20 w-72 right-0 mt-4 mr-4 rounded-xl text-white bg-blue-300 p-1">
          <p className="text-lg font-bold">
            Kalan Yanlış Renk Oranı: {falseColorsPercentage}%
          </p>
          <p className="text-lg font-bold">
            Süre: {minutes}:{seconds}
          </p>
          <p className="text-lg font-bold">Adım: {step}/3</p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-grow">
        {!isStart && <div className="table">{renderColors()}</div>}

        <Footer />

        {allColorsFound && (
          <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
            <div
              className="bg-white p-8 rounded-md text-center"
              style={{ width: '300px' }}
            >
              <p style={{ fontSize: '20px' }}>
                Tebrikler! Egzersizi başarıyla tamamladınız. <br />
              </p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={generateRandomMatrix}
              >
                Tekrar
              </button>
              <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        )}

        {isStart && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
              <h2 className="font-semibold text-2xl p-1">
                Renk Bulma Egzersizi
              </h2>
              <p className="pb-2">
                Oyunda, doğru ve yanlış renklerin rastgele yerleştirildiği bir
                matriste yanlış renkleri bulup seçmeye çalışarak tamamlanmış bir
                listeye ulaşmayı amaçlarsınız.
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
              <p>
                Egzersiz Tamamlama Süresi: {minutes}:{seconds}
              </p>
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
    </div>
  )
}

export default ColorMismatchGame
