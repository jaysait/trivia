import React from 'react';
import Flashcard from './Flashcard';

const FlashcardList = ({ flashcards, updateScores }) => {
  return (
    <div className='card-grid'>
      {flashcards.map((flashcard) => {
        return <Flashcard flashcard={flashcard} key={flashcard.id} updateScores={updateScores} />;
      })}
    </div>
  );
};

export default FlashcardList;
