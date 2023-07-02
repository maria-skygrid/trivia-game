import TriviaContext from "../context/trivia"
import { useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import { BiRightArrowAlt } from "react-icons/bi";

import Question from "./question"
import Score from "./score";

const Game = () => {
  const { data, currentQuestion, setCurrentQuestion, validated, setValidated, setIsPlaying } = useContext(TriviaContext)
  const [ shuffledAnswers, setShuffledAnswers ] = useState([]);
  const [ displayScore, setDisplayScore ] = useState(false)

  const handleNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    setValidated(false)
  };

  const hideDisplayScore = () => {
    console.log("changing the score display to false");
    setCurrentQuestion(0)
    setDisplayScore(false)
    setIsPlaying(false)
    console.log(displayScore);
  }

  const handleDisplayScore = () => {
    console.log("We are going to SHOW the score now");
    setDisplayScore(true)
  }

  useEffect(() => {
    if (currentQuestion >= 0 && currentQuestion < data.length) {
      const currentAnswers = data[currentQuestion].incorrect_answers.map((answer) => {
        return { choice: answer, correct: false };
      });

      const correctAnswer = { choice: data[currentQuestion].correct_answer, correct: true };

      const allAnswers = [...currentAnswers, correctAnswer];

      const shuffled = allAnswers.map((answer, index) => ({
        ...answer,
        id: uuidv4(),
        displayOrder: Math.random(),
        index,
      })).sort((a, b) => a.displayOrder - b.displayOrder);

      setShuffledAnswers(shuffled);
    }
    if (currentQuestion === 5) {
      console.log("Last question!! Now we will display the score");
      handleDisplayScore()
    }
  }, [currentQuestion, data, setIsPlaying]);

  const renderQuestion = data.map((element, index) => {
    const key = uuidv4();
    if (index === currentQuestion) {
      return (
        <Question
          key={key}
          question={element.question}
          id={index + 1}
          shuffledAnswers={shuffledAnswers}
          incorrect={element.incorrect_answers}
          answer={element.correct_answer}
          onNextQuestion={handleNextQuestion}
        />
      );
    }
    return null;
  });

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="p-8 md:px-2 md:py-5 h-[70%] md:h-[55%] w-[95%] md:w-[50%] bg-white rounded-md shadow-lg">
        { displayScore
        ? ( <Score displayScore={hideDisplayScore}/> )
        : (
          <div className="h-full md:w-4/5 m-auto flex flex-col items-center justify-between">
            <div>
              <p className="inline-block px-3 py-1 mb-4 font-bold text-sm bg-yellow-dark rounded-md">{currentQuestion + 1} / 5</p>
              {renderQuestion}
            </div>
            {validated && <div className="flex items-center bg-yellow hover:bg-yellow-dark text-sm px-4 py-2 rounded-md font-bold tracking-wide cursor-pointer"
              onClick={handleNextQuestion}>
              <p className="mr-4 align-right">Go to next question</p>
              <BiRightArrowAlt />
            </div> }
          </div>
      )}
     </div>
    </div>
  )
}

export default Game
