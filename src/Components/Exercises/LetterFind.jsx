import React, { useState, useEffect } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Footer from '../Footer'

const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHİJKLMNOPQRSTUVWXYZ'
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}

const placeWordsInMatrix = (matrix, wordsToFind) => {
  const placedWords = new Set()
  const rows = matrix.length
  const columns = matrix[0].length

  const checkSpace = (row, col, word, vertical) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = vertical ? row + i : row
      const newCol = vertical ? col : col + i
      if (
        newRow >= rows ||
        newCol >= columns ||
        matrix[newRow][newCol] !== ''
      ) {
        return false
      }
    }
    return true
  }

  const placeWord = (row, col, word, vertical) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = vertical ? row + i : row
      const newCol = vertical ? col : col + i
      matrix[newRow][newCol] = word[i]
    }
  }

  wordsToFind.forEach((word) => {
    let placed = false
    while (!placed) {
      const vertical = Math.random() < 0.5
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * columns)

      if (checkSpace(row, col, word, vertical)) {
        placeWord(row, col, word, vertical)
        placed = true
        placedWords.add(word)
      }
    }
  })

  return placedWords
}

const generateMatrix = (wordsToFind, rows, columns) => {
  const matrix = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => '')
  )

  const placedWords = placeWordsInMatrix(matrix, wordsToFind)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (matrix[i][j] === '') {
        matrix[i][j] = generateRandomLetter()
      }
    }
  }

  return { matrix, placedWords }
}

const LetterFind = ({ dayNumber }) => {
  const exerciseName = 'letter-find'
  const [matrix, setMatrix] = useState([])
  const [allWords, setAllWords] = useState([])
  const [wordsToFind, setWordsToFind] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [selectedCells, setSelectedCells] = useState([])
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [currentStage, setCurrentStage] = useState(1)
  const [rows, setRows] = useState(17)
  const [columns, setColumns] = useState(20)

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  const handleConfirm = () => {
    setIsConfirmed(true)
  }

  useEffect(() => {
    if (isStart && !isFinish) {
      const timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStart, isFinish])

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
          setAllWords(response.data[0].words[dayNumber - 1])
          setRows(response.data[0].matrix[dayNumber - 1][0])
          setColumns(response.data[0].matrix[dayNumber - 1][1])
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
    if (allWords.length > 0) {
      const wordsForStage = allWords.slice(
        (currentStage - 1) * 6,
        currentStage * 6
      )
      setWordsToFind(wordsForStage)
    }
  }, [allWords, currentStage])

  useEffect(() => {
    const { matrix, placedWords } = generateMatrix(wordsToFind, rows, columns)
    setMatrix(matrix)
  }, [wordsToFind, rows, columns])

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

  const restartExercise = () => {
    setIsFinish(false)
    setFoundWords([])
    setSelectedCells([])
    setCurrentStage(1)
    const { matrix, placedWords } = generateMatrix(wordsToFind, rows, columns)
    setMatrix(matrix)
    setElapsedTime(0)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const handleCellClick = (i, j) => {
    let selectedWord = null
    let selectedWordOrientation = null
    let selectedWordPosition = null

    const directions = [
      { name: 'horizontal', dx: 1, dy: 0 },
      { name: 'vertical', dx: 0, dy: 1 },
      { name: 'horizontalBack', dx: -1, dy: 0 },
      { name: 'verticalBack', dx: 0, dy: -1 },
    ]

    for (const direction of directions) {
      for (const word of wordsToFind) {
        for (let k = 0; k < word.length; k++) {
          const startRow = i - k * direction.dy
          const startCol = j - k * direction.dx
          let checkWord = ''
          for (let l = 0; l < word.length; l++) {
            const currentRow = startRow + l * direction.dy
            const currentCol = startCol + l * direction.dx
            if (
              currentRow < 0 ||
              currentRow >= rows ||
              currentCol < 0 ||
              currentCol >= columns
            ) {
              break
            }
            checkWord += matrix[currentRow][currentCol]
          }
          if (checkWord === word) {
            selectedWord = word
            selectedWordOrientation = direction.name
            selectedWordPosition = { row: startRow, col: startCol }
            break
          }
        }
        if (selectedWord) break
      }
      if (selectedWord) break
    }

    if (selectedWord && !foundWords.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord])
      setSelectedCells((cells) => [
        ...cells,
        ...getWordCells(
          matrix,
          selectedWord,
          selectedWordPosition.row,
          selectedWordPosition.col,
          selectedWordOrientation
        ),
      ])

      if (foundWords.length + 1 === wordsToFind.length) {
        if (currentStage === 3) {
          playCongrulationSound()
          setIsFinish(true)
          if (isFirst) {
            exerciseOver()
          }
          setIsFirst(false)
        } else {
          setCurrentStage(currentStage + 1)
          setFoundWords([])
          setSelectedCells([])
        }
      } else {
        playCorrectSound()
      }
    }
  }

  const handleStart = () => {
    setIsStart(true)
  }

  const getWordCells = (matrix, word, row, col, orientation) => {
    const cells = []
    if (orientation === 'horizontal' || orientation === 'horizontalBack') {
      const startCol =
        orientation === 'horizontal' ? col : col - word.length + 1
      for (let c = startCol; c < startCol + word.length; c++) {
        cells.push({ row, col: c })
      }
    } else if (orientation === 'vertical' || orientation === 'verticalBack') {
      const startRow = orientation === 'vertical' ? row : row - word.length + 1
      for (let r = startRow; r < startRow + word.length; r++) {
        cells.push({ row: r, col })
      }
    }
    return cells
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <header className=" w-full fixed top-0  flex justify-center items-center p-1 bg-blue-300">
        <h1 className="text-xl font-semibold text-white">Kelime Bulma Oyunu</h1>
      </header>
      <div className="absolute top-0 right-0 mt-16 mr-8 p-4 w-40 flex flex-col justify-center items-center border-2 border-b-gray-100 rounded-md text-lg font-semibold">
        {formatTime(elapsedTime)}
      </div>
      <div className="flex flex-col justify-center items-center mt-4 ml-6">
        <div className="mb-4 bg-blue-100 h-5/6 mt-4 rounded-xl overflow-auto">
          <table>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`border text-sm font-semibold h-4 border-gray-300 p-3 cursor-pointer ${
                        selectedCells.some((c) => c.row === i && c.col === j)
                          ? 'bg-green-500'
                          : 'hover:bg-blue-200'
                      }`}
                      onClick={() => handleCellClick(i, j)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <div className="w-1/4 h-4/5  ml-4 mr-4 mt-11 flex-col flex justify-center items-center">
        <h2 className="text-xl font-semibold">Bulunacak Kelimeler:</h2>
        <div className="flex flex-col">
          {wordsToFind.map((word, index) => (
            <div
              key={index}
              className={`my-4 border border-gray-300 p-3 text-center ${
                foundWords.includes(word) ? 'bg-green-500' : 'bg-blue-200'
              } rounded-xl`}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Kelime Bulma Egzersizi
            </h2>
            <p className="pb-2">Verilen tabloda istenen kelimeleri bulun</p>
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
            <p>Geçen Süre: {formatTime(elapsedTime)}</p>
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
  )
}

export default LetterFind
