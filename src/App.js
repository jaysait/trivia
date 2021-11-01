import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './App.css';
import axios from 'axios';
import { FcApproval, FcDisclaimer } from 'react-icons/fc';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [correct, setCorrect] = useState('');

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php').then((res) => {
      setCategories(res.data.trivia_categories);
    });
  }, []);

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value,
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.results.map((questionItem, index) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [...questionItem.incorrect_answers, answer];
            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
      });
  }

  const handleUpdateScores = (event) => {
    event.preventDefault();

    const isCorrect = event.target.children[0].innerHTML === '*' ? 'correct' : 'wrong';
    setCorrect(isCorrect);
    setTimeout(() => {
      setCorrect('');
    }, 1000);
  };

  return (
    <>
      {correct !== '' && (
        <div className='notify'>
          {correct === 'correct' && <FcApproval size='5rem' />}
          {correct === 'wrong' && <FcDisclaimer size='5rem' />}
        </div>
      )}
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>Number of Questions</label>
          <input type='number' id='amount' min='1' step='1' defaultValue={10} ref={amountEl} />
        </div>
        <div className='form-group'>
          <button className='btn' id='generate_button'>
            Generate
          </button>
        </div>
      </form>
      <div className='container'>
        <FlashcardList flashcards={flashcards} updateScores={handleUpdateScores} />
      </div>
    </>
  );
}

export default App;
