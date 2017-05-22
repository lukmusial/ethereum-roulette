pragma solidity ^0.4.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MoneyBack.sol";

contract TestMoneyBack {

  uint public initialBalance = 10 ether;

  function testCanSendMoneyBack() {

    MoneyBack money = MoneyBack(DeployedAddresses.MoneyBack());

    Assert.equal(money.moneyBack(1), true, "send money succeeded");
  }

  function testMultiplex() {
    MoneyBack money = MoneyBack(DeployedAddresses.MoneyBack());

    Assert.equal(money.moneyBack(1), true, "send money succeeded");

  }
}
