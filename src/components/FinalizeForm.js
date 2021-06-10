import React, { Component } from 'react'

class FinalizeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0'
    }
  }

  render() {
    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          this.props.finalize()
        }}>
        <button type="submit" className="btn btn-primary btn-block btn-lg">Finalize</button>
      </form>
    );
  }
}

export default FinalizeForm;