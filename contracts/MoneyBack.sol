pragma solidity ^0.4.10;

contract MoneyBack {
    mapping (address => uint) balances;
    uint fraction;

    modifier nonEmptyOrRefund(uint len) {
        if (len > 0) {
            _;
        } else if(!msg.sender.send(msg.value)) throw;
    }

    function moneyBack(uint amount) returns (bool) {
        return msg.sender.send(amount);
    }

    function multiplex(address[] addresses) nonEmptyOrRefund(addresses.length) payable {
        uint dividedAmount = msg.value / addresses.length;
        for (uint i = 0; i < addresses.length; i++) {
            balances[addresses[i]] += dividedAmount;
        }
    }

    function withdraw() {
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}