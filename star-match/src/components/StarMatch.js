import { Fragment, useState } from "react";

// number component
const PlayNumber = props => (
  // Here is how to test onClick: onClick={()=> console.log('Num', props.number)}
  <button 
  className="number" 
  style={{ backgroundColor: colors[props.status]}}
  onClick={()=> props.onClick(props.number, props.status)}>
  {props.number} 
  </button>  
);


// stars component
const StarsDisplay = props => (
// using dynamic expression and mapping to get stars populated
// Fragment is to group multiple elements without adding extra node to DOM
<Fragment>
  {utils.range(1, props.count).map(starId => (
  <div key={starId} className="star" />  
  ))}
</Fragment>
);


const StarMatch = () => {
    // making stars a state element when they have a value that will change (tip)
    const [stars, setStars] = useState(utils.random(1, 9));  
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([]);

    const candidatesAreWrong = utils.sum(candidateNums) > stars;

    // function to pass number status
    const numberStatus = (number) => {
      if (!availableNums.includes(number)) {
        return 'used';
      }
      if (candidateNums.includes(number)) {
        return candidatesAreWrong ? 'wrong': 'candidate';
      }
      return 'available';
    };

    // funtion to define what will happen with every number click
    const onNumberClick = (number, currentStatus) => {
      // currentStatus => newStatus
      if (currentStatus === 'used') {
        return;
      }
  
      const newCandidateNums =
        currentStatus === 'available'
          ? candidateNums.concat(number)
          : candidateNums.filter(cn => cn !== number);
  
      if (utils.sum(newCandidateNums) !== stars) {
        setCandidateNums(newCandidateNums);
      } else {
        const newAvailableNums = availableNums.filter(
          n => !newCandidateNums.includes(n)
        );
        setStars(utils.randomSumIn(newAvailableNums, 9));
        setAvailableNums(newAvailableNums);
        setCandidateNums([]);
      }
    };


    return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
            <StarsDisplay 
            count={stars}
            />
          </div>
          <div className="right">
          {/* TIP: with components, think: 1- UI logic to describe state, 2- App logic to change state */}
          {/* using dynamic expression/mapping to get numbers populated */}
            {utils.range(1, 9).map(number => 
              <PlayNumber 
              key={number} 
              number={number} 
              status={numberStatus(number)}
              onClick={onNumberClick}
              />
            )}
          </div>
        </div>
        <div className="timer">Time Remaining: 10</div>
      </div>
    );
  };
  
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
    range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),
  
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