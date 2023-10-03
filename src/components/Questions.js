import React, { useEffect, useState } from 'react';
import { useFetchQuestion } from '../hooks/FetchQuestion';
import { useDispatch, useSelector } from 'react-redux';
import { updateResult } from '../hooks/setResult';

export default function Questions({ onChecked }) {
  const [checked, setChecked] = useState(undefined);
  const { trace } = useSelector((state) => state.questions);
  const result = useSelector((state) => state.result.result);
  const [{ isLoading, apiData, serverError }] = useFetchQuestion();

  const questions = useSelector(
    (state) => state.questions.queue[state.questions.trace]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (trace !== undefined) {
      dispatch(updateResult({ trace, checked }));
    }
  }, [trace, checked, dispatch]);

  function onSelect(i) {
    onChecked(i);
    setChecked(i);
  }

  if (isLoading) return <h3 className="text-light">Loading</h3>;
  if (serverError)
    return <h3 className="text-light">{serverError || 'Unknown Error'}</h3>;
  return (
    <div className="questions">
      <h2 className="text-light">{questions?.question}</h2>
      <ul>
        {questions?.options.map((q, i) => (
          <li key={i}>
            <input
              type="radio"
              value={i} // Use the value attribute to store the option index
              name="options"
              id={`q${i}-option`}
              onChange={() => onSelect(i)}
            />
            <label className="text-primary" htmlFor={`q${i}-option`}>
              {q}
            </label>
            <div
              className={`check ${result[trace] === i ? 'checked' : ''}`}
            ></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
