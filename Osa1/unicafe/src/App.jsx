import { useState } from "react";

const Statistics = ({
  good,
  neutral,
  bad,
  total,
  average,
  positivePercentage,
}) => {
  return (
    <>
      <StatisticsLine text="good" value={good} />
      <StatisticsLine text="neutral" value={neutral} />
      <StatisticsLine text="bad" value={bad} />
      <StatisticsLine text="total" value={total} />
      <StatisticsLine text="average" value={average} />
      <StatisticsLine text="positive" value={positivePercentage} />
    </>
  );
};
const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td> {value}</td>
    </tr>
  );
};

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const handleGood = () => {
    setGood(good + 1);
    setTotal(total + 1);
  };
  const handleNeutral = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
  };

  const handleBad = () => {
    setBad(bad + 1);
    setTotal(total + 1);
  };

  const average = total === 0 ? 0 : (good - bad) / total;
  const positivePercentage = total === 0 ? 0 : (good / total) * 100;

  return (
    <>
      <div>
        <h2>Give feedback</h2>

        <Button handleClick={handleGood} text="Good" />
        <Button handleClick={handleNeutral} text="Neutral" />
        <Button handleClick={handleBad} text="Bad" />
      </div>
      <div>
        <h2>Statistics</h2>
        {total > 0 ? (
          <table>
            <tbody>
              <Statistics
                good={good}
                neutral={neutral}
                bad={bad}
                total={total}
                average={average}
                positivePercentage={positivePercentage}
              />
            </tbody>
          </table>
        ) : (
          <p>No feedback given</p>
        )}
      </div>
    </>
  );
};

export default App;
