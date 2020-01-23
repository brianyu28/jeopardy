import React from 'react';
import './GameLoader.css';
import sample_game from './assets/sample_game.json';

function validateGame(data) {
  const game = data.game;
  if (game === undefined) {
    console.log('Game key not found in JSON payload.');
    return false;
  }
  // TODO: additional validation
  return true;
}

class GameLoader extends React.Component {
  render() {
    return (
      <div className="game-loader">
        <h1>Jeopardy Player</h1>
        <p>Designed by Brian Yu</p>
        <hr/>
        <h2>Play a Game</h2>
        <input type="file" name="file" onChange={this.gameLoadedHandler}/>
        <hr/>
        <h2>Create a Game</h2>
        <div className="create-your-own">
          To create a Jeopardy game, download the below game configuration file,
          edit it to include your desired clues, and re-upload it here.
          <div>
            <button onClick={this.downloadSampleGame}>Download Configuration</button>
          </div>
        </div>
      </div>
    );
  }

  gameLoadedHandler = (event) => {
    event.target.files[0].text()
         .then(text => {
            const data = JSON.parse(text);
            if (validateGame(data)) {
              this.props.updateGame(data);
            } else {
              console.log("Invalid game.");
            }
         });
  }

  downloadSampleGame = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(sample_game, null, 4)], {type: "text/plain"});
    element.href = URL.createObjectURL(file);
    element.download = "sample_game.json";
    document.body.appendChild(element);
    element.click();
  }
}

export default GameLoader;