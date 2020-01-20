import React from 'react';

class FinalJeopardy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: true,
      solution: false
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.clueKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.clueKeyPress);
  }

  render() {
    const { category, solution } = this.state;
    const { final } = this.props;

    if (category) {
      return (
        <div className="clue">
          <div className="clue-display final-category">
            {final.category}
          </div>
        </div>
      )
    }
    return (
      <div className="clue">
        <div className="clue-display">
          {solution ? final.solution : final.clue}
        </div>
      </div>
    )
  }

  clueKeyPress = (event) => {
    const { category, solution } = this.state;

    if (event.key === " ") {
        if (category) {
          this.setState({
            category: false,
            solution: false
          });
        } else {
          this.setState(state => ({
            solution: !state.solution
          }));
        }
    } else if (event.key === "Escape" && !category && solution) {
      this.props.finishGame();
    }
  }
}

export default FinalJeopardy;