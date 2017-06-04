var MoneyBack = artifacts.require("./MoneyBack.sol");
//var Roulette = artifacts.require("./Roulette.sol");

module.exports = function(deployer) {
  deployer.deploy(MoneyBack);
//  deployer.deploy(Roulette);
};
