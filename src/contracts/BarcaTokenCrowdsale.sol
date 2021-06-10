pragma solidity 0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/TokenTimelock.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/RefundableCrowdsale.sol";

contract BarcaTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale, TimedCrowdsale, RefundableCrowdsale  {

  // Token Distribution
  uint256 public tokenSalePercentage    = 50;
  uint256 public founderPercentage      = 10;

  // Token reserve funds
  address[] public founders;

  // Token time lock
  uint256 public releaseTime;
  address[5] public foundersTimelock;
  uint256 public initialSupply;

  //debug
  uint256 public _alreadyMinted;
  uint256 public _finalTotalSupply;

  constructor(
    uint256 _rate,
    address payable _wallet,
    ERC20 _token,
    uint256 _cap,
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _initialSupply,
    address[] memory _founders,
    uint256 _releaseTime
  )
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_openingTime, _closingTime)
    RefundableCrowdsale(_initialSupply / 2)
    public
  {
    require(_initialSupply <= _cap);
    require(_founders.length >= 5);
    founders      = _founders;
    releaseTime   = _releaseTime;
    initialSupply = _initialSupply;
  }

  /**
  * @dev Extend parent behavior requiring purchase to respect inital supply.
  * @param _beneficiary Token purchaser
  * @param _weiAmount Amount of wei contributed
  */
  function _preValidatePurchase(
    address _beneficiary,
    uint256 _weiAmount
  )
    internal view
  {
    super._preValidatePurchase(_beneficiary, _weiAmount);
    require(weiRaised().add(_weiAmount) <= initialSupply);
  }

  /**
   * @dev enables token transfers, called when owner calls finalize()
  */
  function _finalization() internal {
    if (goalReached()) {
      _alreadyMinted = token().totalSupply();
      _finalTotalSupply = _alreadyMinted.div(tokenSalePercentage).mul(100);

      for (uint i = 0; i < 5; i++) {
        foundersTimelock[i]  = address(new TokenTimelock(token(), founders[i], releaseTime));
        ERC20Mintable(address(token())).mint(foundersTimelock[i],  _finalTotalSupply.mul(founderPercentage).div(100));
      }

      //_mintableToken.finishMinting();
      ERC20Mintable(address(token())).renounceMinter();

      // Unpause the token
      ERC20Pausable(address(token())).unpause();
      //_pausableToken.transferOwnership(wallet);
    }

    super._finalization();
  }

}
