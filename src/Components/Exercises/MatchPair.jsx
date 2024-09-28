import React, { useState, useEffect } from "react";
import apple from "../../assets/apple.jpeg";
import banana from "../../assets/banana.jpeg";
import cherry from "../../assets/cherry.jpeg";
import grape from "../../assets/grape.jpeg";
import orange from "../../assets/orange.jpeg";
import pear from "../../assets/pear.jpeg";
import strawberry from "../../assets/strawberry.jpeg";
import watermelon from "../../assets/watermelon.jpeg";
import lemon from "../../assets/lemnon.png";
import blackberry from "../../assets/blackberry.png";

import { playCorrectSound } from "../../effect/Correct";
import { playInCorrectSound } from "../../effect/Incorrect";
import { playCongrulationSound } from "../../effect/Congrulation";
import { playStepSound } from "../../effect/Step";

import ExerciseService from "../../services/ExerciseService";
import LoaderSimple from "../LoadPage/LoaderSimple";
import FullscreenAlert from "../LoadPage/FullscreenAlert";

const fruitImages = [
  apple,
  banana,
  cherry,
  grape,
  orange,
  pear,
  strawberry,
  watermelon,
  lemon,
  blackberry,
];

const MatchPair = ({ dayNumber }) => {
  const exerciseName = "matchpair";
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [cardView, setCardView] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 4 });

  const token = window.localStorage.getItem("token");
  const day = window.localStorage.getItem("day");
  const [isFirst, setIsFirst] = useState(true);
  const exerciseService = new ExerciseService();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [totalRounds, setTotalRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [roundStart, setRoundStart] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [matrixSize, setMatrixSize] = useState([2, 2]);

  useEffect(() => {
    setGridSize({ rows: matrixSize[currentRound-1][0], cols: matrixSize[currentRound-1][1] });
  }, [matrixSize, currentRound]);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          day: dayNumber,
          token: token,
          exerciseName: exerciseName,
        };

        const response = await exerciseService.getExerciseData(data);

        if (response.status === 200) {
          setIsLoading(false);
          setMatrixSize(response.data[0].matrix[dayNumber - 1]);
          setTotalRounds(response.data[0].matrix[dayNumber - 1].length);
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
        dayNumber: dayNumber,
        name: exerciseName,
        time: elapsedSeconds,
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

  const generateCards = () => {
    const totalCards = gridSize.rows * gridSize.cols;
    const selectedImages = fruitImages.slice(0, totalCards / 2);
    const duplicatedImages = [...selectedImages, ...selectedImages];
    const shuffledImages = duplicatedImages.sort(() => Math.random() - 0.5);

    setCards(
      shuffledImages.map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
    );
  };

  const handleStart = () => {
    setIsStart(true);
    setCurrentRound(1);
    setElapsedSeconds(0);
    setRoundStart(false);
  };

  const flipCard = (index) => {
    if (
      flippedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      !roundStart
    )
      return;

    playStepSound();
    setCards((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prevFlipped) => [...prevFlipped, index]);
  };

  const startRound = () => {
    setRoundStart(true);
  };

  const endRound = () => {
    if (currentRound < totalRounds) {
      setRoundStart(false);
      setMatchedCards([]);
      generateCards();
      seeCards();
      setCurrentRound(currentRound + 1);
    } else {
      setIsFinish(true);
      setRoundStart(false); // Oyun bittiğinde roundStart'ı false yap
      if (isFirst) {
        exerciseOver();
      }
      setIsFirst(false);
    }
  };

  useEffect(() => {
    const checkMatch = () => {
      if (flippedCards.length === 2) {
        const [firstIndex, secondIndex] = flippedCards;
        if (cards[firstIndex].image === cards[secondIndex].image) {
          playCorrectSound();
          const newMatched = [...matchedCards, firstIndex, secondIndex];
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                newMatched.includes(card.id)
                  ? { ...card, isMatched: true }
                  : card
              )
            );
            setMatchedCards(newMatched);
          }, 1000);
          setFlippedCards([]);
        } else {
          playInCorrectSound();
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                matchedCards.includes(card.id)
                  ? card
                  : { ...card, isFlipped: false }
              )
            );
            setFlippedCards([]);
          }, 200);
        }
      }
    };

    checkMatch();
  }, [flippedCards, cards, matchedCards]);

  useEffect(() => {
    let intervalId;
    if (roundStart) {
      intervalId = setInterval(() => {
        setElapsedSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [roundStart]);

  useEffect(() => {
    if (matchedCards.length === gridSize.rows * gridSize.cols && roundStart) {
      setTimeout(() => {
        endRound();
      }, 1000);
    }
  }, [matchedCards, gridSize, roundStart]);

  const seeCards = () => {
    setCardView(false);
    setTimeout(() => {
      setCardView(true);
      setTimeout(() => {
        setCardView(false);
        startRound();
      }, 2000);
    }, 2000);
  };

  useEffect(() => {
    generateCards();
    if (isStart) {
      seeCards();
    }
  }, [isStart, gridSize]);

  useEffect(() => {
    let timer;
    if (isFinish) {
      playCongrulationSound();
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isFinish]);

  const formattedTime = new Date(elapsedSeconds * 1000).toISOString().substr(14, 5);

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`;
  };

  const handleGridSizeChange = (rows, cols) => {
    if (rows * cols <= 10 && rows <= 5 && cols <= 5) {
      setGridSize({ rows, cols });
    }
  };

  if (isLoading) {
    return <LoaderSimple />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header className="w-full fixed top-0 flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">Eşini Bul</h1>
      </header>

      <div className="fixed right-4 top-24 w-38 h-16 bg-blue-400 rounded-lg p-4 flex flex-col items-center justify-center">
        <div className="text-xl text-white">Süre: {formattedTime}</div> {/* Güncellenmiş süre */}
        <div className="text-xl text-white">
          Tur: {currentRound}/{totalRounds}
        </div>
      </div>

      <div
        className="grid gap-4 mt-20"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`w-24 h-24 ${
              card.isMatched ? "" : "border border-gray-300"
            } rounded-md flex justify-center items-center cursor-pointer
                        ${
                          !matchedCards.includes(card.id)
                            ? "bg-gray-200"
                            : "bg-transparent"
                        }`}
            onClick={() => !matchedCards.includes(card.id) && flipCard(index)}
          >
            {cardView && (
              <img
                src={card.image}
                alt={`card-${index}`}
                className="max-w-full max-h-full"
              />
            )}
            {!matchedCards.includes(card.id) && card.isFlipped ? (
              <img
                src={card.image}
                alt={`card-${index}`}
                className="max-w-full max-h-full"
              />
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>

      <footer className="w-full flex justify-center items-center p-4 fixed bottom-0 bg-blue-300">
        <span className="text-white font-semibold">
          © 2024 Eleven. Tüm hakları saklıdır.
        </span>
      </footer>

      {/* Oyun Sonu Ekranı */}
      {isFinish && (
        <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div
            className="bg-white p-8 rounded-md text-center"
            style={{ width: "300px" }}
          >
            <p style={{ fontSize: "20px" }}>
              Tebrikler! Oyunu Tamamladınız!
              <br />
              Tamamlanma Süresi: {formattedTime}
            </p>
            <button
              onClick={handleReturnDashboard}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Anasayfaya Dön
            </button>
          </div>
        </div>
      )}

      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Eşini Bul Egzersizi</h2>
            <p className="pb-2">
              Bu bir zihin geliştirme egzersizidir. İlk aşamada açılan kartların
              yerlerini aklınızda tutup eşleştirin.
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
  );
};

export default MatchPair;