import styled from "styled-components";
import Header from "./Header";
import Button from "./Button";
import Deadman from "./DeadMan";
import DeadLetters from "./DeadLetters";
import TheWord from "./TheWord";
import Keyboard from "./Keyboard";
import GameOverModal from "./GameOverModal";

import { useState } from "react";
import words from "../data/words.json";

import { colors, contentWidth } from "./GlobalStyles";

const initialGameState = { started: false, over: false, win: false };

const App = () => {
  const [game, setGame] = useState(initialGameState);
  const [word, setWord] = useState({ string: "", revealed: [] });
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);

  const handleStart = () => {
    setGame({ ...game, started: !game.started });
    if (!word.string) {
      getNewWord();
    }
  };

  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    const revealedArray = Array.from(randomWord, () => "");

    setWord({ string: randomWord, revealed: revealedArray });
  };

  const getButtonLabel = () => {
    if (!game.started && !word.string) {
      return "Start";
    }
    if (game.started) {
      return "Pause";
    } else {
      return "Continue";
    }
  };

  const handleGuess = (ltr) => {
    // lots of logic in here.
    setUsedLetters([...usedLetters, ltr]);
    if (word.string.includes(ltr)) {
      const updateRevealed = word.string
        .split("")
        .map((letter, index) =>
          usedLetters.includes(letter)
            ? letter
            : word.string[index] === ltr
            ? ltr
            : word.revealed[index]
        );
      setWord({ ...word, revealed: updateRevealed });
    } else {
      setWrongGuesses([...wrongGuesses, ltr]);
    }
    if (wrongGuesses.length >= 10){
      handleEndGame (false)
    } else if (word.revealed.join("") === word.string){
      handleEndGame(true)
    }
  };

  const handleReset = () => {
    setWord({ string: "", revealed: [] });
    setWrongGuesses([]);
    setUsedLetters([]);
    getNewWord();
  };

  const handleEndGame = (win) => {
    setGame({...game, over: true, win});
    alert(`Game Over! You ${win ? "win" : "lose"}`);
  };


  return (
    <Wrapper>
      {/* <GameOverModal /> */}
      <Header />
      <Nav>
        <Button onClickFunc={handleStart}>{getButtonLabel()}</Button>
        <Button onClickFunc={handleReset}>Reset</Button>
      </Nav>
      {game.started && (
        <>
          <Container>
            <Deadman />
            <RightColumn>
              <DeadLetters wrongGuesses={wrongGuesses} />
              <TheWord word={word.string} revealed={word.revealed} />
            </RightColumn>
          </Container>
          <Keyboard
            usedLetters={usedLetters}
            setUsedLetters={setUsedLetters}
            handleGuess={handleGuess}
          />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${colors.blue};
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  height: 100vh;
  padding: 0 0 64px 0;
`;
const Nav = styled.div`
  max-width: ${contentWidth};
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${contentWidth};
  min-width: 320px;
  position: relative;
  padding: 20px 0;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;
const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

export default App;
