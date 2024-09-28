import React, { useEffect, useState } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playStepSound } from '../../effect/Step'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'


const GrowingCircle = ({dayNumber}) => {

  const exerciseName = "growingcircle";
  const [circles, setCircles] = useState([{ size: 3 }])
  const [speed, setSpeed] = useState(1000)
  const [isFinish, setIsFinish] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [isStart, setIsStart] = useState(false)

  const token = window.localStorage.getItem("token");
  const day = window.localStorage.getItem("day");
  const [isFirst, setIsFirst] = useState(true);
  const exerciseService = new ExerciseService();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  },[])

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
          setCountdown(response.data[0].time[dayNumber-1])
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
    let interval
    let countdownInterval

    const startGrowing = () => {
      interval = setInterval(() => {
        setCircles((prevCircles) => {
          const lastCircle = prevCircles[prevCircles.length - 1]
          const newSize = lastCircle.size + 5

          if (newSize > 40) {
            setSpeed((prevSpeed) => prevSpeed - prevSpeed * 0.1)
            return [{ size: 3 }]
          } else if (speed < 100 || countdown === 0) {
            clearInterval(interval)
            playCongrulationSound();
            setIsFinish(true);
            if(isFirst){
              exerciseOver();
            }
            setIsFirst(false);
            return prevCircles
          } else {
            return [...prevCircles, { size: newSize }]
          }
        })
        playStepSound()
      }, speed)

      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    }

    if (!isFinish && isStart) {
      startGrowing()
    }

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [isFinish, countdown, speed, isStart])

  const handleStart = () => {
    setIsStart(true)
  }
  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60
  const formattedCountdown = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`

  const restartExercise = () => {
    setCircles([{ size: 3 }])
    setSpeed(1000)
    setIsFinish(false)
    setCountdown(60)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`;
  };
  

  if (isLoading) {
    return <LoaderSimple />;
  }

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <header className="w-full fixed top-0 flex justify-center items-center p-4 bg-blue-300">
          <h1 className="text-3xl font-semibold text-white">Büyüyen Daire</h1>
        </header>
        <div className="relative">
          {circles.map((circle, index) => (
            <div
              key={index}
              className="rounded-full border-2 border-blue-500"
              style={{
                width: `${circle.size}rem`,
                height: `${circle.size}rem`,
                position: 'absolute',
                borderWidth: 5,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          ))}
        </div>
        <footer className="w-full fixed bottom-0 flex justify-center items-center p-4 bg-blue-300">
          <span className="text-white font-semibold">
            © 2024 Eleven. Tüm hakları saklıdır.
          </span>
        </footer>
      </div>
      <div className="absolute top-20 right-0 m-4">
        <div
          className="text-white font-bold bg-blue-300 rounded-md p-2"
          style={{ width: '60px' }}
        >
          {formattedCountdown}
        </div>
      </div>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">İzleyici Egzersizi</h2>
            <p className="pb-2">
              Metin içinde kelimeleri egzersizle beraber sizde takip edin.
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
            <p style={{ fontSize: '20px' }}>Egzersiz Tamamlandı!</p>
            <button
              onClick={restartExercise}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Tekrar
            </button>
            <div>
              <button onClick={handleReturnDashboard} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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

export default GrowingCircle
