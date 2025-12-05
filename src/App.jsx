import { useState, useEffect } from "react";
import "./App.css";
import Cards from "./components/Cards";
import Confetti from "react-confetti";
import Form from "./components/Form";
import Leaderboard from "./components/Leaderboard";
import { motion } from "framer-motion";
import { saveGameStats } from "./utils/api";
import WinLose from "./components/WinLose";


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
  const [difficulty, setDifficulty] = useState("beginner");
  const [isGameLost, setIsGameLost] = useState(false);
  const [name, setName] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);


  const difficultyLevels = {
    beginner: 40,
    easy: 30,
    medium: 20,
    hard: 15,
    insane: 10,
  }

  // Toggle background overlay when game is active
  useEffect(() => {
    const body = document.body;
    body.classList.toggle("bg-darken", isGameStarted);
    return () => {
      body.classList.remove("bg-darken");
    };
  }, [isGameStarted]);

  useEffect(() => {
    if (cardFlips >= difficultyLevels[difficulty]) {
      localStorage.setItem("difficulty", difficulty);
      localStorage.setItem("cardFlips", cardFlips);
      
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

  async function gameWon(){
    console.log("Game won");
    setIsGameWon(true)
    
    // Save game stats to database
    if (name && difficulty) {
      try {
        await saveGameStats(name, difficulty, cardFlips, true);
        console.log("Game stats saved successfully");
      } catch (error) {
        console.error("Failed to save game stats:", error);
      }
    }
    
    const timer = setTimeout(() => {
      resetGame()
    }, 10000)
    return () => clearTimeout(timer)
  }

  async function gameLost(){
    console.log("Game lost");
    setIsGameLost(true)
    
    // // Save game stats to database (even for losses)
    // if (name && difficulty) {
    //   try {
    //     await saveGameStats(name, difficulty, cardFlips, false);
    //     console.log("Game stats saved successfully");
    //   } catch (error) {
    //     console.error("Failed to save game stats:", error);
    //   }
    // }
    
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
      // Increment flips when selecting a new card after 2 are already selected
      setCardFlips((prevCardFlips) => prevCardFlips + 1);
      setSelectedEmojis([{ name, index }]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const category = formData.get("category");
    const difficultyValue = formData.get("difficulty");
    const nameValue = formData.get("name");
    
    setName(nameValue);
    setDifficulty(difficultyValue);
    
    if (category === "") {
      setError("Please select a category");
      return;
    }
    
    setSelectedCategory(category);
    setCardFlips(0); // Reset flips for new game
    grabEmojis(category);
    setIsGameStarted(true)
  }

  return (
    <>
    
    <main>
      {isGameWon && <WinLose isGameWon={isGameWon} />}
      {isGameLost && <WinLose isGameLost={isGameLost} />}
      <div className="game-container">
      {isGameWon && <Confetti />}
      <button
      onClick={() => setShowLeaderboard(!showLeaderboard)}
      className="btn btn--leaderboard"
    >
      {showLeaderboard ? "Hide Leaderboard" : "View Leaderboard"}
    </button>
      <div className="header-section">
        <h1>Emoji Memory Game</h1>
      </div>

      {showLeaderboard ? (
        <Leaderboard />
      ) : !isGameStarted ? (
        <Form handleSubmit={handleSubmit} cat={selectedCategory} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="game-container-motion"
        >
          <div className="stats mb-4">
            <p className="text-2xl text-neutral-500">
              Name: <span className="text-neutral-100">{name}</span>
            </p>
            <p className="text-2xl text-neutral-500">
              Difficulty: <span className="text-neutral-100 capitalize">{difficulty}</span>
            </p>
            <p className="text-2xl text-neutral-500">
              Card Flips: <span className="text-neutral-100">{cardFlips} of {difficultyLevels[difficulty]}</span>
            </p>
          </div>

          {isGameLost && (
            <p className="text-2xl text-red-500 mb-4">
              Game Lost! You exceeded the flip limit.
            </p>
          )}
          {isGameWon && (
            <p className="text-2xl text-green-500 mb-4">
              Congratulations! You won with {cardFlips} flips!
            </p>
          )}

          <Cards
            data={emojis}
            handleClick={handleFlip}
            matchedEmojis={matchedEmojis}
            selectedEmojis={selectedEmojis}
          />
        </motion.div>
      )}
      </div>
    </main>
    </>
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
