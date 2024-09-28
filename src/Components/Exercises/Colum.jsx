import React, { useState, useEffect, useRef } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import { playCongrulationSound } from '../../effect/Congrulation'
import { AlignCenter } from 'lucide-react'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'


const Colum = ({dayNumber}) => {

  const exerciseName = 'colum'
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [speed, setSpeed] = useState(300)
  const [currentPage, setCurrentPage] = useState(0)
  const wordRefs = useRef([])
  const gridRef = useRef(null)
  const [wordsArray, setWordsArray] = useState([])
  const [columns, setColumns] = useState(4);
  const [wordsPerPage, setWordsPerPage] = useState(12);


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
          setWordsArray(response.data[0].words[dayNumber-1].split(" "))
          setSpeed(response.data[0].speed[dayNumber-1])
          setColumns(response.data[0].columns[dayNumber-1])
          setWordsPerPage(response.data[0].words_per_page[dayNumber-1])

          console.log(response.data[0].words_per_page[dayNumber-1])
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
    let interval
    if (started && !completed) {
      interval = setInterval(() => {
        setCurrentWordIndex((prev) => {
          const nextIndex = prev + 1
          if (nextIndex >= (currentPage + 1) * wordsPerPage) {
            if (nextIndex >= wordsArray.length) {
              setCompleted(true)
              playCongrulationSound()
              exerciseOver();
              setStarted(false)
              return prev
            } else {
              setCurrentPage(currentPage + 1) // Yeni sayfa
              return nextIndex
            }
          }

          wordRefs.current[nextIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })

          return nextIndex
        })
      }, speed)
    }
    return () => clearInterval(interval)
  }, [started, completed, speed, currentPage])

  const startTracking = () => {
    if (!started) {
      setCompleted(false)
      setStarted(true)
      setCurrentWordIndex(0)
    }
  }

  const handleStart = () => {
    setIsStart(true)
  }

  const restartExercise = () => {
    setIsStart(false)
    setCompleted(false)
    setStarted(false)
    setCurrentWordIndex(0)
    setCurrentPage(0) // Sayfa sıfırla
    if (wordRefs.current[0]) {
      wordRefs.current[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const getGridStyle = () => {
    return {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridAutoRows: 'minmax(40px, auto)',
      wordWrap: 'break-word',
      padding: '5px',
      boxSizing: 'border-box',
      // Eklenen özellikle:      flexDirection: 'column', // Öğeleri dikey olarak hizalar
      alignItems: 'center', // Öğeleri yatayda ortalar
      justifyContent: 'center', // Öğeleri dikeyde ortalar
    }
  }

  const getHighlightedStyle = (index) => {
    return index === currentWordIndex
      ? {
          backgroundColor: 'orange',
          padding: '7px',
          fontSize: '1.25rem',
        }
      : { padding: '7px', fontSize: '1.25rem' }
  }

  const getCurrentPageWords = () => {
    const startIndex = currentPage * wordsPerPage
    const endIndex = startIndex + wordsPerPage
    return wordsArray.slice(startIndex, endIndex)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }


  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <Header title={'Sütun Okuma'} />
      <div className="flex-grow flex justify-center items-center overflow-hidden">
        <div
          className="bg-blue-200 h-3/4 w-full rounded-lg sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 flex justify-center items-center p-4"
          ref={gridRef}
        >
          <div
            className="grid gap-4 w-full h-full font-bold text-xl"
            style={getGridStyle()}
          >
            {getCurrentPageWords().map((word, index) => (
              <div
                key={index}
                className="text-center"
                style={getHighlightedStyle(
                  currentPage * wordsPerPage + index
                )}
                ref={(el) =>
                  (wordRefs.current[currentPage * wordsPerPage + index] = el)
                }
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mb-4">
        <button
          onClick={startTracking}
          className="mb-8 text-xl p-2 w-16 bg-blue-400 hover:bg-blue-300 text-white rounded"
          disabled={started}
        >
          Başla
        </button>
      </div>

      <Footer />
      {completed && (
        <div>
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
                onClick={restartExercise}
              >
                Tekrar
              </button>
              <div>
                <button onClick={handleReturnDashboard} className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
                  Anasayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Sütun Blok Okuma</h2>
            <p className="pb-2">Sütunları takip ederek egzersizi tamamlayın</p>
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

export default Colum
