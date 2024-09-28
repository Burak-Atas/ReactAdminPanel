import React, { useState, useEffect, useRef } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playStepSound } from '../../effect/Step'
import Footer from '../Footer'
import Header from '../Header'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const FirstLetterSecondLetter = ({ dayNumber }) => {
  const exerciseName = 'firstlettersecondletter'
  const [content, setContent] = useState(
    `Modern dünyada, teknoloji ve iletişim araçlarının gelişimiyle birlikte yaşam biçimlerimizde büyük değişiklikler yaşanmaktadır. İnternet, akıllı telefonlar, sosyal medya platformları gibi araçlar hayatımızın her alanına nüfuz etmiş durumdadır. Bu teknolojik ilerlemeler, iletişimi kolaylaştırmakla birlikte, aynı zamanda bazı olumsuz etkilere de neden olmaktadır. Birçok kişi, teknolojinin artan etkisiyle sosyal ilişkilerin zayıfladığına, insanların birbirleriyle daha az etkileşimde bulunduğuna inanmaktadır. Özellikle gençler, internet üzerinden sanal ortamlarda zaman geçirmeyi tercih ederek gerçek dünyadaki sosyal etkileşimleri azaltmaktadır. Bu durum, yalnızlık ve izolasyon gibi sorunların ortaya çıkmasına yol açabilir. Ancak, teknolojinin sosyal etkileri sadece olumsuz değildir. Örneğin, uzak mesafelerdeki aile üyeleri veya arkadaşlar arasındaki iletişim artık çok daha kolay ve ucuzdur. Video konferans araçları sayesinde birbirimizi görebilir ve hatta sanal ortamlarda bir araya gelerek etkileşimde bulunabiliriz. Bu da insanların birbirleriyle bağlarını güçlendirebilir. Bununla birlikte, teknolojinin sosyal etkileri üzerine yapılan araştırmalar hala devam etmektedir. Özellikle çocuklar ve gençler üzerindeki etkileri yakından incelenmektedir. Aşırı teknoloji kullanımının sosyal becerileri ve duygusal gelişimi nasıl etkilediği konusunda daha fazla bilgiye ihtiyaç vardır. Sonuç olarak, teknolojinin sosyal etkileri karmaşıktır ve tek bir yönde değildir. İletişimi kolaylaştırırken aynı zamanda yalnızlık ve izolasyon gibi sorunlara da neden olabilir. Ancak, doğru kullanıldığında teknoloji, insanların birbirleriyle bağlantı kurmalarına ve iletişimlerini geliştirmelerine yardımcı olabilir.`
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const contentRef = useRef(null)
  const [highlightIndex, setHighlightIndex] = useState(0) // 0: ilk kelime, 1: son kelime
  const [currentPage, setCurrentPage] = useState(0) // Sayfa numarası (0'dan başlıyor)
  const [speed, setSpeed] = useState(1000)
  // Ayarlanabilir satır ve kelime sayısı
  const [wordsPerLine, setWordsPerLine] = useState(10) // Her satırda kaç kelime olacağı
  const [linesPerPage, setLinesPerPage] = useState(8) // Her sayfada kaç satır olacağı
  const [title, setTitle] = useState('')
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
          console.log(response.data)
          setContent(response.data[0].content[dayNumber - 1])
          setTitle(response.data[0].title[dayNumber - 1])
          setWordsPerLine(response.data[0].words_per_line[dayNumber - 1])
          setLinesPerPage(response.data[0].lines_per_page[dayNumber - 1])
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
        dayNumber: dayNumber,
        name: exerciseName,
        time: 0,
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

  // Metni satırlara ayır
  const wordsArray = content.split(' ')
  const lines = []
  for (let i = 0; i < wordsArray.length; i += wordsPerLine) {
    lines.push(wordsArray.slice(i, i + wordsPerLine))
  }

  // Satırları sayfalara ayır
  const pages = []
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage))
  }

  const handleStop = () => {
    setIsStarted(false)
  }

  useEffect(() => {
    let interval
    if (isStarted) {
      interval = setInterval(() => {
        setHighlightIndex((prevIndex) => {
          // Eğer son kelimedeysek ve son sayfanın son satırındaysak
          if (
            prevIndex === 1 &&
            currentIndex === pages[currentPage].length - 1 &&
            currentPage === pages.length - 1
          ) {
            setIsFinish(true)
            setIsStarted(false)
            playCongrulationSound()
            exerciseOver()
            return 0
          } else if (prevIndex === 1) {
            // Eğer son kelimedeysek
            setCurrentIndex(
              (prevIndex) => (prevIndex + 1) % pages[currentPage].length
            )
            // Sonraki sayfa varsa sayfa numarasını arttır
            if (
              currentIndex === pages[currentPage].length - 1 &&
              currentPage < pages.length - 1
            ) {
              setCurrentPage(currentPage + 1)
            }
            return 0
          } else {
            // İlk kelimedeysek
            return 1
          }
        })

        if (contentRef.current) {
          const currentWordElement = contentRef.current.querySelector(
            `#word-${currentIndex}-${highlightIndex === 0 ? 'first' : 'last'}`
          )
          if (currentWordElement) {
            currentWordElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }
        }
      }, speed)
      playStepSound()
    }

    return () => clearInterval(interval)
  }, [isStarted, currentIndex, highlightIndex, currentPage])

  const handleStart = () => {
    setIsStart(true)
  }

  const handleStarted = () => {
    setIsStarted(true)
    setIsFinish(false)
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  const restartExercise = () => {
    setIsStarted(false)
    setIsFinish(false)
    setCurrentIndex(0)
    setCurrentPage(0)
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  const handleReset = () => {
    setIsStarted(false)
    setIsFinish(false)
    setCurrentIndex(0)
    setCurrentPage(0)
    setHighlightIndex(0)
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="absolute top-0 w-full">
        <Header title={'İlk Kelime Son Kelime'} />
      </div>
      <div
        className="flex flex-col justify-center pl-24 pr-10 text-2xl h-3/4 p-3 w-full md:w-3/4 overflow-auto  shadow-lg text-left"
        ref={contentRef}
      >
        <h2 className="font-semibold">{title}</h2>
        {pages[currentPage].map((line, lineIndex) => (
          <p key={lineIndex} className="text-left break-words">
            {line.map((word, wordIndex) => (
              <span
                key={wordIndex}
                id={`word-${lineIndex}-${wordIndex === 0 ? 'first' : 'last'}`}
                style={{
                  background:
                    lineIndex === currentIndex &&
                    ((highlightIndex === 0 && wordIndex === 0) ||
                      (highlightIndex === 1 && wordIndex === line.length - 1))
                      ? 'yellow'
                      : 'transparent',
                }}
              >
                {word}
                {wordIndex !== line.length - 1 && ' '}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div className="b mt-5">
        {!isStarted && (
          <button
            className="bg-blue-400 p-2 rounded-xl text-white hover:bg-blue-300"
            onClick={handleStarted}
          >
            Başla
          </button>
        )}

        {isStarted && (
          <>
            <button
              className=" bg-green-400 p-2 rounded-xl mr-4 text-white hover:bg-green-300"
              onClick={handleStop}
            >
              Durdur
            </button>
            <button
              className="bg-red-400 p-2 rounded-xl text-white hover:bg-red-300"
              onClick={handleReset}
            >
              Sıfırla
            </button>
          </>
        )}
      </div>
      <Footer />
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              İlk ve Son Kelime Egzersizi
            </h2>
            <p className="pb-2">
              Metin içinde ilk ve son kelimeleri takip edin.
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
        <div className="bg-gray-300 bg-opacity-50 flex items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Alıştırma bitti!</p>
            <button
              onClick={handleReturnDashboard}
              className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
            >
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                onClick={restartExercise}
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
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

export default FirstLetterSecondLetter
