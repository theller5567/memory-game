import { useState, useEffect } from "react";
import "./App.css";
import Cards from "./components/Cards";
import Confetti from "react-confetti";
import Form from "./components/Form";
import { motion } from "framer-motion";


function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchedEmojis, setMatchedEmojis] = useState([]);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cardFlips, setCardFlips] = useState(0);
  const [difficulty, setDifficulty] = useState("insane");
  const [isGameLost, setIsGameLost] = useState(false);


  const difficultyLevels = {
    beginner: 40,
    easy: 30,
    medium: 20,
    hard: 15,
    insane: 10,
  }

  useEffect(() => {
    if (cardFlips >= difficultyLevels[difficulty]) {
      gameLost()
    }
  }, [cardFlips, difficulty]);

  useEffect(() => {
    if (matchedEmojis.length && matchedEmojis.length === emojis.length) {
      gameWon();
    }
  }, [matchedEmojis, emojis]);

  function resetGame(){
    setIsGameStarted(false)
    setIsGameWon(false)
    setIsGameLost(false)
    setEmojis([])
    setMatchedEmojis([])
    setSelectedEmojis([])
    setCardFlips(0)
  }

  function gameWon(){
    console.log("Game won");
    setIsGameWon(true)
    const timer = setTimeout(() => {
      resetGame()
    }, 10000)
    return () => clearTimeout(timer)
  }

  function gameLost(){
    console.log("Game lost");
    setIsGameLost(true)
    const timer = setTimeout(() => {
      resetGame()
    }, 10000)
    return () => clearTimeout(timer)
  }

  useEffect(() => {
    if (
      selectedEmojis.length === 2 &&
      selectedEmojis[0].name === selectedEmojis[1].name
    ) {
      setMatchedEmojis((prevMatchedCards) => [
        ...prevMatchedCards,
        ...selectedEmojis,
      ]);
    }
  }, [selectedEmojis]);

  async function grabEmojis(category) {
    try {
      setIsLoading(true)
      const response = await fetch(
        `https://emojihub.yurace.pro/api/all/category/${category}`
      );
      const data = await response.json();
      if (!response.ok) {
        setIsLoading(false)
        throw new Error("Failed to fetch emojis");
      }
      setIsGameStarted(true)
      const dataSlice = grabRandomEmojis(data);
      const dataSample = shuffleArray(dataSlice);
      setIsLoading(false)

      setEmojis(dataSample);
    } catch (error) {
      setError(error);
      setIsLoading(false);
      console.error("Error fetching emojis:", error);
    }
  }

  function grabRandomEmojis(data) {
    const randomEmojis = [];
    while (randomEmojis.length < 10) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomEmoji = data[randomIndex];
      if (!randomEmojis.includes(randomEmoji)) {
        randomEmojis.push(randomEmoji);
      }
    }
    return randomEmojis;
  }

  function shuffleArray(array) {
    const shuffledArray = [...array, ...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[j];
      shuffledArray[j] = temp;
    }
    return shuffledArray;
  }

  function handleFlip(name, index) {
    console.log("name: ", name);
    const selectedCardEntry = selectedEmojis.find(
      (emoji) => emoji.index === index
    );

    if (!selectedCardEntry && selectedEmojis.length < 2) {
      setSelectedEmojis((prevSelectedEmojis) => [
        ...prevSelectedEmojis,
        { name, index },
      ]);
    } else if (!selectedCardEntry && selectedEmojis.length === 2) {
      setCardFlips((prevCardFlips) => prevCardFlips + 1);
      setSelectedEmojis([{ name, index }]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const category = formData.get("category");
    console.log("category: ", category);
    if (category === "") {
      setError("Please select a category");
      return;
    }
    setSelectedCategory(category);
    grabEmojis(category);
    setIsGameStarted(true)
  }

  return (
    <main>
      {isGameWon && <Confetti />}
      <h1 className="text-5xl font-bold text-cyan-500">Memory Game</h1>
      {!isGameStarted ? 
        <Form handleSubmit={handleSubmit} cat={selectedCategory} /> :
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        exitTransition={{ duration: 1 }}
        >
          <p className="mt-4 text-2xl text-neutral-500">Difficulty: <span className="text-neutral-100">{difficulty}</span></p>
          <p className="text-2xl text-neutral-500">Card Flips: <span className="text-neutral-100">{cardFlips} of {difficultyLevels[difficulty]}</span></p>
          {isGameLost && <p className="text-2xl text-red-500">Game lost</p>}
          {isGameWon && <p className="text-2xl text-green-500">Game won</p>}
        
        <Cards
          data={emojis}
          handleClick={handleFlip}
          matchedEmojis={matchedEmojis}
          selectedEmojis={selectedEmojis}

        />
        </motion.div>
      }
    </main>
  );
}

export default App;

// ✅ if 2 cards are selected, check if they match
  // ✅ if they match, add them to the matchedEmojis array
  // ✅ if they don't match, remove them from the selectedEmojis array
  // if card is selected add selected class to the card
  // if 2 cards are selected and not a match remove the selected class from the cards
  // if 2 cards are selected and a match add the matched class to the cards
  //if the matchedEmojis array is equal to the emojis array, the game is won
  //if the game is won, show a victory message
