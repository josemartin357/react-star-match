import {useState, useEffect} from "react";

// stars component uses range function and count prop as parameter to map and make star(s) and give each one the starId key
const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId => (
      <div key={starId} className="star" />
    ))}
  </>
);

// number component sets style based on status props defined in colors array 
// component takes onClick function in which it passes props number and status
const PlayNumber = props => (
  <button
    className="number"
    style={{backgroundColor: colors[props.status]}} 
    onClick={() => props.onClick(props.number, props.status)}
  >
    {props.number}
  </button>
);

// component invites user to play again
const PlayAgain = props => (
	<div className="game-done">
  	<div 
    	className="message"
      // depending value of gameStatus, the color is red or green
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}
    >
      {/* depending value of gameStatus, different messages appear */}
  	  {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
  	</div>
    {/* button takes an onClick passed by to PlayAgain as props */}
	  <button onClick={props.onClick}>Play Again</button>
	</div>
);

const Game = (props) => {
  const [stars, setStars] = useState(utils.random(1, 9)); // stars is variable for # of stars. It's state defined by random function
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9)); // availableNums is an array with initial state defined by range function which produces an [] of numbers
  const [candidateNums, setCandidateNums] = useState([]); // candidateNums is an array with empty initial value
  const [secondsLeft, setSecondsLeft] = useState(10); // secondsLeft is a number with initial value of 10

// useEffect allows side-effects to occur
	useEffect(() => {
    // when there are seconds left and numbers available, run setter function setSecondsLeft to decrease secondsLeft by 1
  	if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
	      setSecondsLeft(secondsLeft - 1);
      }, 1000);
    	return () => clearTimeout(timerId); //clear timer once it reaches endpoint
  	}
  });

  const candidatesAreWrong = utils.sum(candidateNums) > stars; // candidatesAreWrong(boolean) when sum of items in candidateNums array is higher than number of stars (when user is wrong)


  const gameStatus = availableNums.length === 0 
  	? 'won'
    : secondsLeft === 0 ? 'lost' : 'active' // when the available numbers is 0, gameStatus is 'won'; when time runs out, gameStatus is 'lost'; else gameStatus is 'active'

  // numberStatus takes number as parameter and returns 'available' 'used' 'wrong' or 'candidate'
  const numberStatus = number => {
    if (!availableNums.includes(number)) {
      return 'used'; // when number is not included in availableNums array, return 'used'
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate'; // when number included in candidateNums array, return: 1- wrong is candidatesAreWrong occurs. 2- else return 'candidate'
    }
    return 'available'; // else, return 'available'
  };

// onNumberClick handles what happens when a number is clicked
// onNumberClick gets passed to PlayNumber thru onClick
// for number and currentStatus parameters, PlayNumber assigns number and status
  const onNumberClick = (number, currentStatus) => {

    // HANDLING SITUATIONS WHEN NOTHING NEEDS TO HAPPEN WHEN NUMBER CLICKED
    // When gameStatus not active or when currentStatus is used, dont allows clicks. 
    if (gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }

    // HANDLING SITUATIONS WHEN NUMBERS BECOME CANDIDATES AND WHEN CANDIDATES/WRONG NUMBERS BECOME AVAILABLE 
    // else when currentStatus not used, make new variable which:
    // 1- if status is available will take values of candidateNums array combined with number (number clicked on) 
    // 2- else (if number was not used or available, aka its a 'candidate' or 'wrong'), filter out of candidateNums array
		const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);


    // HANDLING WHEN CANDIDATE NUMBERS ARE CORRECT
    // if sum of candidate numbers doesnt equal stars(yet), add candidate numbers to candidate numbers array
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } 
    // is sum of candidate numbers matches stars ...
    else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      ); // make new available numbers [] that takes values from available numbers array filtering out the new candidate nums
      setStars(utils.randomSumIn(newAvailableNums, 9)); // setter function gives stars values from new available numbers array
      setAvailableNums(newAvailableNums); // setter function gives available numbers array values from new available numbers array
      setCandidateNums([]); // empty candidate numbers array
    }
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {/* display PlayAgain when gameStatus is not active */}
          {gameStatus !== 'active' ? (
          	<PlayAgain 
            onClick={props.startNewGame} //Game sends startNewGame function to PlayAgain props
            gameStatus={gameStatus} // Game sends PlayAgain gameStatus prop the value of gameStatus in Game
            />
          ) : 
          // StarsDisplay handles stars box
          // else if gameStatus is active, display StarsDisplay
          (
          	<StarsDisplay 
            count={stars} // Game sends StarsDisplay count props the Game value of stars 
            />
          )}
        </div>
        <div className="right">
          {/* PlayNumber handles numbers box */}
          {/* Using range utils function and mapping each number as PlayNumber */}
          {utils.range(1, 9).map(number => (
            <PlayNumber
              key={number} // Game sends PlayNumber key props the Game value of number 
              status={numberStatus(number)} // Game sends PlayNumber status props the return value of numberStatus function applied to number
              number={number} // Game sends PlayNumber number props the Game value of number
              onClick={onNumberClick} // Game sends PlayNumber onClick props the Game function onNumberClick 
            />
          ))}
        </div>
      </div>
      {/* secondsLeft is variable in useState @ Game */}
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// StarMatch is parent component of Game
// StarMatch takes a gameId initially set as 1. The function startNewGame makes a new gameId everytime PlayAgain is clicked on. By making a new gameId assigned to the key, we make a new game that resets Game
const StarMatch = () => {
	const [gameId, setGameId] = useState(1);
	return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({length: max - min + 1}, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;

// TIPS
// - use map/filter/reduce 
// - make things dynamic 
// - lean javascript closures (see onClick test) 
// - extract components - split responsabilities by separating components; use items that share similar data & behavior

// STEPS FOR DEVELOPMENT
// 1- Started with StarMatch(now Game), jsx layout and classes. Also colors array, and utils array
// 2- Changed stars and numbers divs to appear with dynamic expression and mapping.
// 3- Made components StarsDisplay(from stars, with count prop and with Fragment) and PlayNumber(from numbers with key and number props); and added to StarMatch.
// 4- Added numberStatus() in StarMatch and passed returned value to style in PlayNumber's button
// 5- Added onNumberClick() to PlayNumber (to define how the status of the numbers will change when clicked) 
// 6- Added logic to unclick numbers
// 7- Added PlayAgain component
// 8- Worked timer with useEffect
// 9- Improved game status to start logic for game over message and improved conditions to avoid user clicks when game over
// 10- Made new game component Game and placed inside StarMatch to unmount thru key and reset game