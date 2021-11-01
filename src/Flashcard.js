import React, { useState, useEffect, useRef } from 'react';

const FlashCard = ({ flashcard, updateScores }) => {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState('initial');
  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(() => {
    setMaxHeight();
  }, [flashcard.question, flashcard.answer, flashcard.options]);
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight);
    return () => window.removeEventListener('resize', setMaxHeight);
  }, []);
  return (
    <div className={`card ${flip ? 'flip' : ''}`} style={{ height: height }}>
      <div className='front' ref={frontEl}>
        {flashcard.question}{' '}
        <button onClick={() => setFlip(!flip)} className='btn btn-dont'>
          give up?
        </button>
        <div className='flashcard-options'>
          {flashcard.options.map((option) => {
            return (
              <div
                className='flashcard-option'
                key={option}
                value={flashcard.id}
                onClick={updateScores}>
                {option}
                <div style={{ display: 'none' }}>{option === flashcard.answer ? '*' : 'x'}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='back' ref={backEl} onClick={() => setFlip(!flip)}>
        {flashcard.answer}
      </div>
    </div>
  );
};

export default FlashCard;
