import React, { useState, useEffect, useRef } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playStepSound } from '../../effect/Step'
import Header from '../Header'
import Footer from '../Footer'
const AwayWords = () => {
  const initialArr = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'aa',
    'bb',
    'cc',
    'dd',
    'ee',
    'ff',
    'gg',
    'hh',
    'ii',
    'jj',
    'kk',
    'll',
    'mm',
    'nn',
    'oo',
    'pp',
    'rr',
    'ss',
    'tt',
    'uu',
    'vv',
    'ac',
    'lb',
    'hg',
    'jk',
    'rt',
    'yz',
    'mx',
    'wn',
    'op',
    'qr',
    'st',
  ]

  const [isStart, setIsStart] = useState(false)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [words, setWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const wordRefs = useRef([])
  const [exerciseStart, setExerciseStart] = useState(false)
  const [sliceStartIndex, setSliceStartIndex] = useState(0)
  const [lampIndices, setLampIndices] = useState(Array(11).fill(false))
  const [speed, setSpeed] = useState(1000)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState('outward')

  const handleStart = () => {
    setIsStart(true)
    setWords(initialArr.slice(0, 11))
    setLampIndices(Array(11).fill(false))
  }

  const resetExercise = () => {
    wordRefs.current.forEach((ref) => {
      if (ref) {
        ref.textContent = ''
      }
    })

    setIsStart(false)
    setExerciseCompleted(false)
    setExerciseStart(false)
    setWords([])
    setCurrentWordIndex(0)
    setSliceStartIndex(0)
    setLampIndices(Array(11).fill(false))
    setIsPaused(false)
    setDirection('outward')
  }

  useEffect(() => {
    if (exerciseStart && !isPaused) {
      const middleIndex = Math.floor(wordRefs.current.length / 2)
      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          wordRefs.current.forEach((ref) => {
            if (ref) {
              ref.textContent = ''
            }
          })
          setLampIndices(Array(11).fill(false))

          let targetIndices = []
          if (direction === 'outward') {
            if (currentWordIndex === 0) {
              targetIndices = [middleIndex]
            } else {
              const offset = Math.floor((currentWordIndex + 1) / 2)
              targetIndices =
                currentWordIndex % 2 === 1
                  ? [middleIndex - offset, middleIndex + offset]
                  : [middleIndex + offset, middleIndex - offset]
            }
          } else {
            const offset = Math.floor((currentWordIndex + 1) / 2)
            targetIndices =
              currentWordIndex % 2 === 1
                ? [offset - 1, 10 - offset]
                : [offset, 10 - offset]
          }

          targetIndices.forEach((index, i) => {
            if (index >= 0 && index < wordRefs.current.length) {
              wordRefs.current[index].textContent = words[currentWordIndex + i]
              setLampIndices((prevLampIndices) => {
                const newLampIndices = [...prevLampIndices]
                newLampIndices[index] = true
                return newLampIndices
              })
            }
          })

          setCurrentWordIndex(currentWordIndex + targetIndices.length)
          playStepSound()

          if (currentWordIndex + targetIndices.length >= words.length) {
            if (direction === 'outward') {
              setDirection('inward')
              setCurrentWordIndex(0)
            } else {
              clearInterval(interval)
              wordRefs.current.forEach((ref) => {
                if (ref) {
                  ref.textContent = ''
                }
              })
              setLampIndices(Array(11).fill(false))

              const nextSliceStartIndex = sliceStartIndex + 11
              if (nextSliceStartIndex < initialArr.length) {
                setTimeout(() => {
                  const nextSlice = initialArr.slice(
                    nextSliceStartIndex,
                    nextSliceStartIndex + 11
                  )
                  if (nextSlice.length === 0) {
                    playCongrulationSound()
                    setExerciseCompleted(true)
                  } else {
                    setWords(nextSlice)
                    setSliceStartIndex(nextSliceStartIndex)
                    setCurrentWordIndex(0)
                    setDirection('outward')
                  }
                }, 500)
              } else {
                setTimeout(() => {
                  playCongrulationSound()
                  setExerciseCompleted(true)
                }, 500)
              }
            }
          }
        }
      }, speed)

      return () => clearInterval(interval)
    }
  }, [
    exerciseStart,
    words,
    currentWordIndex,
    sliceStartIndex,
    isPaused,
    direction,
  ])

  return (
    <div className="h-screen overflow-hidden">
      <Header title={'Uzaklaşan Kelimeler'} />

      <div className="relative h-3/4 w-full flex flex-col items-center justify-center mt-4 text-xl text-center">
        <div
          id="kelimeler"
          className="relative flex flex-row justify-between text-center mt-36 overflow-hidden h-28"
        >
          {Array.from({ length: 11 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <span
                className={`border-2 p-2 w-32  h-12 ${
                  index === Math.floor(11 / 2) ? 'bg-green-300' : ''
                }`}
                ref={(el) => (wordRefs.current[index] = el)}
              ></span>
              {lampIndices[index] && (
                <div className="w-4 h-4 bg-red-500 rounded-full mt-2"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-64 space-x-4">
          {!exerciseStart && (
            <button
              className="text-lg p-2 text-white rounded-xl w-32 bg-blue-400 hover:bg-green-400"
              disabled={exerciseCompleted}
              onClick={() => setExerciseStart(true)}
            >
              Başla
            </button>
          )}
          {exerciseStart && (
            <>
              <button
                className="text-lg p-2 text-white rounded-xl bg-yellow-400 w-32 hover:bg-green-400"
                onClick={() => setIsPaused(!isPaused)}
                onMouseEnter={(e) =>
                  (e.target.textContent = isPaused ? 'Devam Et' : 'Durdur')
                }
                onMouseLeave={(e) =>
                  (e.target.textContent = isPaused ? 'Durdur' : 'Durdur')
                }
              >
                Durdur
              </button>
              <button
                className="text-lg p-2 text-white rounded-xl bg-red-400 w-32 hover:bg-red-300"
                onClick={resetExercise}
              >
                Sıfırla
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />

      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Uzaklaşan Kelime Egzersizi
            </h2>
            <p className="pb-2">
              Ekranda verilen kırmızı noktayı takip ederek çıkan kelimeleri
              okuyun.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={() => handleStart()}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      {exerciseCompleted && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler! Alıştırmayı tamamladınız.</p>
            <button className="bg-blue-400 text-white py-2 px-4 mt-4 rounded">
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                onClick={resetExercise}
              >
                Tekrarla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AwayWords
