import React, { useState, useEffect } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playStepSound } from '../../effect/Step'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'


const ZigZag = ({dayNumber}) => {

  const exerciseName = "zigzagyoga";
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [speed, setSpeed] = useState(300) // Yürüme hızı (ms)
  const [moveRight, setMoveRight] = useState(true) // Sağa hareket kontrolü
  const [minutes, setMinutes] = useState(0) // Dakika
  const [seconds, setSeconds] = useState(60) // Saniye
  const [gameOver, setGameOver] = useState(false) // Oyunun bitip bitmediğini tutar
  const [isStart, setIsStart] = useState(false) //Karşılama ekranı


  const [isLoading, setIsLoading] = useState(true);
  const token = window.localStorage.getItem("token");
  const day = window.localStorage.getItem("day");
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  },[])

  const exerciseService = new ExerciseService();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          day: dayNumber,
          token: token,
          exerciseName: exerciseName

        };

        const response = await exerciseService.getExerciseData(data);

        if (response.status === 200) {
          setSeconds(response.data[0].time[dayNumber-1]);
          setSpeed(response.data[0].speed[dayNumber-1]);
          setIsLoading(false);
        } else {
          console.error(response.data);
        }
      } catch (error) {
        console.error("İstek hatası:", error.response.data.error);
      }
    };
    fetchData();
  }, []);

  const exerciseOver = async () => {
    try {
      const data = {
        token: token,
        name: exerciseName
      }
      const response = await exerciseService.setExerciseOver(data);
      if (response.status === 200) {
        console.log(response.data)
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error("İstek hatası:", error.response.data.error);
    }
  };


  useEffect(() => {
    if (isStart) {
      const timeout = setTimeout(() => {
        setSpeed(300) // Başlamadan önce beklenen süre sonunda hızı ayarla
      }, 3000) // Başlamadan önce beklenen süre (ms)

      return () => clearTimeout(timeout)
    }
  }, [isStart])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && isStart) {
        moveZigzag()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [positionX, positionY, gameOver, speed, isStart])

  useEffect(() => {
    if (isStart) {
      const countdown = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else {
          if (minutes === 0) {
            playCongrulationSound()
            clearInterval(countdown)
            console.log('Timer bitti!')
            setGameOver(true)
            if(isFirst){
              exerciseOver();
            }
            setIsFirst(false);
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        }
      }, 1000)

      return () => clearInterval(countdown)
    }
  }, [isStart, minutes, seconds])

  const handleStart = () => {
    setIsStart(true)
  }

  const restartGame = () => {
    setPositionX(0)
    setPositionY(0)
    setMinutes(0)
    setSeconds(60)
    setGameOver(false)
    setIsStart(true) // Oyunu yeniden başlatırken başlangıç ekranını gösterme
    setSpeed(300) // Hızı başlangıç değerine ayarla
  }

  const moveZigzag = () => {
    const screenWidth = 1400 // Ekran genişliği 1500px olarak güncellendi
    const screenHeight = 320
    const stepX = 100 // Yürüme mesafesi (px) 120'den 100'e düşürüldü
    const stepY = 300

    if (moveRight) {
      playStepSound()
      if (positionX + stepX <= screenWidth) {
        setPositionX((prevX) => prevX + stepX)
      } else {
        setMoveRight(false)
      }
    } else {
      playStepSound()
      if (positionX - stepX >= 0) {
        setPositionX((prevX) => prevX - stepX)
      } else {
        setMoveRight(true)
      }
    }

    if (positionY + stepY <= screenHeight) {
      setPositionY((prevY) => prevY + stepY)
    } else {
      setPositionY((prevY) => prevY - stepY)
    }
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`;
  };

  if (isLoading) {
    return <LoaderSimple />;
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <header className="w-full fixed top-0 flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">
          {' '}
          ZigZag Göz Yogası
        </h1>
      </header>
      <div className="absolute top-0 mt-4"></div>
      <div className="absolute top-20 right-0 m-4 mr-8 bg-blue-400 p-2 text-white rounded-lg w-[50px] flex justify-center items-center">
        {`${minutes < 10 ? '0' + minutes : minutes}:${
          seconds < 10 ? '0' + seconds : seconds
        }`}
      </div>
      <footer className="w-full fixed bottom-0 flex justify-center items-center p-4 bg-blue-300">
        <span className="text-white font-semibold">
          © 2024 Eleven. Tüm hakları saklıdır.
        </span>
      </footer>
      {!isStart && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
          style={{ zIndex: isStart ? -1 : 1 }}
        >
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              ZigZag Yoga Egzersizi
            </h2>
            <p className="pb-2">
              Ekrandaki topu boynunuzu hareket ettirmeden sadece gözünüz ile
              takip edin
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
      {gameOver && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler! Alıştırmayı tamamlandınız.</p>
            <button onClick={handleReturnDashboard} className="bg-blue-400 text-white py-2 px-4 mt-4 rounded">
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                onClick={restartGame}
              >
                Tekrarla
              </button>
            </div>
          </div>
        </div>
      )}
      {gameOver ? (
        <div>
          <button
            onClick={restartGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Yeniden Başlat
          </button>
        </div>
      ) : (
        <div
          className=" border-2 relative w-full"
          style={{
            height: '320px',
            maxWidth: '1415px', // Maksimum genişlik sınırlaması güncellendi
            margin: '0 auto',
          }}
        >
          <div
            className="person bg-blue-400"
            style={{
              left: positionX + 'px',
              top: positionY + 'px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              position: 'absolute',
            }}
          ></div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm}/>
    </div>
    
  )
}

export default ZigZag
