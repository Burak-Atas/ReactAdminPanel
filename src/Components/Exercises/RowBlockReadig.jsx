import React, { useState, useEffect } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const RowBlockReading = ({dayNumber}) => {

  const exerciseName = "rowblockread";
  const [text, setText] = useState('')
  const [wordsPerBlock, setWordsPerBlock] = useState(4) // 2-3-4
  const [highlightedWord, setHighlightedWord] = useState(0)
  const [started, setStarted] = useState(false) // Başlama durumunu tutacak state
  const [minutes, setMinutes] = useState(500) // Başlama durumunu tutacak state
  const [isFinish, setIsFinish] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // Current page state
  const [formattedPages, setFormattedPages] = useState([]) // Paginated text


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
          setText(response.data[0].text[dayNumber-1]);
          setMinutes(response.data[0].minutes[dayNumber-1]);
          setWordsPerBlock(response.data[0].words_per_blocks[dayNumber-1])
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
  }


  const handleRestart = () => {
    setHighlightedWord(0)
    setStarted(false)
    setIsFinish(false)
    setIsStart(false)
    setCurrentPage(0)
  }

  useEffect(() => {
    const paginateText = () => {
      const words = text.split(' ')
      const linesPerPage = 8
      const wordsPerLine = 10
      let pages = []

      for (let i = 0; i < words.length; i += wordsPerLine * linesPerPage) {
        const pageWords = words.slice(i, i + wordsPerLine * linesPerPage)
        let pageContent = []

        for (let j = 0; j < pageWords.length; j += wordsPerLine) {
          const lineWords = pageWords.slice(j, j + wordsPerLine)
          pageContent.push(lineWords.join(' '))
        }

        pages.push(pageContent)
      }

      setFormattedPages(pages)
    }

    paginateText()
  }, [text])

  useEffect(() => {
    let interval
    if (started) {
      interval = setInterval(() => {
        setHighlightedWord((prevWord) => {
          const nextWordIndex = prevWord + wordsPerBlock
          const totalWordsOnPage = formattedPages[currentPage]
            .join(' ')
            .split(' ').length
          if (nextWordIndex >= totalWordsOnPage) {
            if (currentPage < formattedPages.length - 1) {
              setCurrentPage((prevPage) => prevPage + 1)
              return 0
            } else {
              setIsFinish(true) // Tüm sayfaları gezince isFinish'i aktif hale getir
              exerciseOver();
              clearInterval(interval) // Interval'i temizle
            }
          }
          return nextWordIndex < totalWordsOnPage ? nextWordIndex : 0
        })
      }, minutes)
    }

    return () => clearInterval(interval)
  }, [formattedPages, wordsPerBlock, started, currentPage])

  useEffect(() => {
    if (isFinish) {
      playCongrulationSound()
      setStarted(false) // Egzersizi durdur
    }
  }, [isFinish])

  const formatText = () => {
    const words = formattedPages[currentPage]
      ? formattedPages[currentPage].join(' ').split(' ')
      : []
    let formattedText = []
    for (let i = 0; i < words.length; i += wordsPerBlock) {
      const block = words.slice(i, i + wordsPerBlock)
      formattedText.push(
        <span key={i}>
          {block.map((word, index) => (
            <span
              key={index}
              className={
                index === block.length - 1 && i === highlightedWord
                  ? 'relative'
                  : ''
              }
            >
              {word}{' '}
              {index === block.length - 1 && i === highlightedWord ? (
                <span className="absolute bottom-0 left-1 w-4 h-1 bg-red-500 rounded-full "></span>
              ) : null}
            </span>
          ))}
        </span>
      )
    }
    return formattedText
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-0 w-full">
        <Header title={'Satır Blok Okuma'} />
      </div>
      <div className="w-3/6 min-h-80  p-16 text-lg shadow-lg text-center rounded-xl ">
        <p className="text-2xl text-left ">{formatText()}</p>
      </div>
      <div className="h-8 mt-2">
        {!started && (
          <button
            onClick={() => setStarted(true)}
            className="bg-blue-300 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded-xl  mt-4 "
          >
            Başla
          </button>
        )}
      </div>
      <Footer />
      {/* Oyun bittiğinde gösterilecek ekran */}
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
              onClick={handleRestart}
              className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
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
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Satır Blok Okuma</h2>
            <p className="pb-2">
              Bu egzersiz sizlere satır aralarında duruklama oranınızı azaltmış
              olacak ve daha hızlı okumanızı sağlayacak. her ne kadar az duruyor
              gibi görünseinzde duruklama hızlı okuma için büyük bir sorundur
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

export default RowBlockReading
