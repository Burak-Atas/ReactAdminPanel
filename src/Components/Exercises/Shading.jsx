import React, { useState, useEffect } from 'react'
import { playStepSound } from '../../effect/Step'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Footer from '../Footer'
import Header from '../Header'

const Shading = ({ dayNumber }) => {
  const exerciseName = 'shading'
  const [text, setText] = useState('')
  const [pages, setPages] = useState([]) // Array of pages, where each page is an array of lines
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showButtons, setShowButtons] = useState(false)
  const [allWordsShadowed, setAllWordsShadowed] = useState(false)
  const [groupCount, setGroupCount] = useState(2) // Default is 2 words
  const [speed, setSpeed] = useState(1000) // Default speed 1000ms
  const [started, setStarted] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [sentence, setSentence] = useState('')
  const [wordsPerLine, setWordsPerLine] = useState(6) // Set to either 6 or 9 words per line

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
  const handleConfirm = () => {
    console.log('Confirmation action triggered')
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
          setSentence(response.data[0].text[dayNumber - 1])
          setGroupCount(response.data[0].group_count[dayNumber - 1])
          setSpeed(response.data[0].speed[dayNumber - 1])
          setWordsPerLine(response.data[0].words_per_line[dayNumber - 1]);
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

  useEffect(() => {
    const sampleWordGroup = sentence.split(' ')
    setText(sentence)

    // Split the words into lines based on wordsPerLine
    const linesArray = []
    for (let i = 0; i < sampleWordGroup.length; i += wordsPerLine) {
      linesArray.push(sampleWordGroup.slice(i, i + wordsPerLine).join(' '))
    }

    // Split lines into pages, each page having 8 lines
    const totalPages = Math.ceil(linesArray.length / 8)
    const pagesArray = Array.from({ length: totalPages }, (_, i) =>
      linesArray.slice(i * 8, (i + 1) * 8)
    )
    setPages(pagesArray)
  }, [sentence, wordsPerLine])

  const exerciseOver = async () => {
    try {
      const data = {
        token: token,
        dayNumber: dayNumber,
        name: exerciseName,
        time: 0,
        correct: 0,
        incorrect: 0,
      };
      const response = await exerciseService.setExerciseOver(data);
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error("İstek hatası:", error.response.data.error);
    }
  };

  const startShading = () => {
    setStarted(true)
  }

  const screenStart = () => {
    setIsStart(true)
  }

  useEffect(() => {
    if (
      started &&
      currentWordIndex <
        pages[currentPageIndex][currentLineIndex]?.split(' ').length
    ) {
      const interval = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          const nextIndex = prevIndex + groupCount
          return nextIndex <=
            pages[currentPageIndex][currentLineIndex].split(' ').length
            ? nextIndex
            : pages[currentPageIndex][currentLineIndex].split(' ').length
        })
      }, speed)

      playStepSound()

      return () => clearInterval(interval)
    } else if (
      started &&
      currentWordIndex >=
        pages[currentPageIndex][currentLineIndex]?.split(' ').length
    ) {
      if (currentLineIndex < pages[currentPageIndex].length - 1) {
        // Move to the next line
        setCurrentLineIndex(currentLineIndex + 1)
        setCurrentWordIndex(0)
      } else if (currentPageIndex < pages.length - 1) {
        // Move to the next page
        setCurrentPageIndex(currentPageIndex + 1)
        setCurrentLineIndex(0)
        setCurrentWordIndex(0)
      } else {
        setAllWordsShadowed(true)
        if (allWordsShadowed) {
          setShowButtons(true)
          playCongrulationSound()
          if (isFirst) {
            exerciseOver()
          }
          setIsFirst(false)
        }
      }
    }
  }, [
    currentWordIndex,
    pages,
    allWordsShadowed,
    groupCount,
    started,
    speed,
    currentLineIndex,
    currentPageIndex,
  ])

  const handleRestart = () => {
    setCurrentPageIndex(0)
    setCurrentLineIndex(0)
    setCurrentWordIndex(0)
    setShowButtons(false)
    setAllWordsShadowed(false)
    setStarted(false)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  const handleNextExercise = () => {
    console.log('Sonraki egzersiz işlevi')
  }

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="absolute top-0 w-full">
        <Header title={'Gölgeli Yazı'} />
      </div>
      <div className="w-2/3 mt-5 h-3/4 border-2 p-3 flex justify-center items-center overflow-y-auto">
        <div className="text-xl text-left leading-relaxed p-4">
          {pages[currentPageIndex]?.map((line, lineIndex) => (
            <p key={lineIndex} className="mb-4">
              {line.split(' ').map((word, wordIndex) => {
                const isCurrentGroup =
                  lineIndex === currentLineIndex &&
                  wordIndex >= currentWordIndex &&
                  wordIndex < currentWordIndex + groupCount
                return (
                  <span
                    key={wordIndex}
                    className={isCurrentGroup ? 'bg-gray-300' : 'text-black'}
                  >
                    {word}{' '}
                  </span>
                )
              })}
            </p>
          ))}
        </div>
      </div>
      <div className="">
        <button
          className="bg-blue-300 hover:bg-blue-200 text-white text-xl py-2 px-4 rounded-xl mb-4 my-16"
          onClick={startShading}
        >
          Başla
        </button>
      </div>
      <Footer />
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Gölgeleme Egzersizi</h2>
            <p className="pb-2">
              Metin içinde kelimeler sırayla kaybolacaktır beraberinde
              kelimeleri sizde takip edin.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={screenStart}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      {showButtons && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler! Alıştırmayı tamamladınız.</p>
            <button
              onClick={handleReturnDashboard}
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
            >
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                onClick={handleRestart}
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

export default Shading
