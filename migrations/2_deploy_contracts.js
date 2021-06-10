const BarcaToken = artifacts.require("./BarcaToken.sol");
const BarcaTokenCrowdsale = artifacts.require("./BarcaTokenCrowdsale.sol");

const ether = (n) => web3.utils.toWei(n.toString(), 'ether');

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};

module.exports = async function(deployer, network, accounts) {

  const _name = "Barca Token";
  const _symbol = "BARCA";
  const _decimals = 18;

  await deployer.deploy(BarcaToken, _name, _symbol, _decimals);
  const deployedToken = await BarcaToken.deployed();

  const latestTime = Math.floor((new Date).getTime()/1000);

  const _rate           = 10000;
  const _wallet         = accounts[0];
  const _token          = deployedToken.address;
  const _openingTime    = latestTime + duration.minutes(1);
  const _closingTime    = _openingTime + duration.minutes(3);
  const _cap            = ether(20);
  const _initialSupply  = ether(10);
  const _founders       = ['0x02930e28dcc07A88703706bFb0D8843FC4Dc9c77','0xE60eaC11C3E31A7181EB0B0D1c61b46897Bd313E','0x7faDc29bFF344716e65652CE9b21C33ae573078D','0x8f867cDe78b3915Ab88C82483C4e5f68ad164Cd9','0x1a5aAb7b90d0aaC3C29FaFcA7e39BCECbdB5FD7F']
  const _releaseTime    = _closingTime + duration.minutes(3);

  await deployer.deploy(
    BarcaTokenCrowdsale,
    _rate,
    _wallet,
    _token,
    _cap,
    _openingTime,
    _closingTime,
    _initialSupply,
    _founders,
    _releaseTime
  );
  const deployedCrowdsale = await BarcaTokenCrowdsale.deployed();

  await deployedToken.pause();
  await deployedToken.addMinter(deployedCrowdsale.address);
  await deployedToken.addPauser(deployedCrowdsale.address);
  //await deployedToken.renounceMinter();
  
  console.log(_openingTime);
  console.log(_closingTime);
  console.log(_releaseTime);

  return true;
};
