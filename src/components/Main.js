import React, { Component } from 'react'
import BuyForm from './BuyForm'
import TransferForm from './TransferForm'
import FinalizeForm from './FinalizeForm'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'buy'
    }
  }

  render() {
    let content
    if(this.state.currentForm === 'buy') {
      content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
      />
    } else if(this.state.currentForm === 'finalize') {
      content = <FinalizeForm
        finalize={this.props.finalize}
      />
    } else if(this.state.currentForm === 'transfer') {
      content = <TransferForm
        // ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        transferTokens={this.props.transferTokens}
      />
    }

    return (
      <div id="content" className="mt-3">

        <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'buy' })
              }}
            >
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'finalize' })
              }}
            >
            Finalize
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'transfer' })
              }}
            >
            Transfer
          </button>
        </div>

        <div className="card mb-4" >

          <div className="card-body">

            {content}

          </div>

        </div>

      </div>
    );
  }
}

export default Main;