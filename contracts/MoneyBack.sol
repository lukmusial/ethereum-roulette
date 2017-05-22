pragma solidity ^0.4.4;


// idea is to just send the money to yourself (can you do that?)
// TODO: ability to split transaction into x substransactions
// TODO: add money to contract only to collect on explicit call?
contract MoneyBack {
    mapping (address => uint) balances;
    uint fraction;

    function moneyBack(uint amount) returns (bool) {
        //transfer throws, send returns bool
        return msg.sender.send(amount);
    }

    function multiplex(address[] addresses) payable {
        uint dividedAmount = 10000; //msg.value / addresses.length;
        for (uint i = 0; i < addresses.length; i++)
            balances[addresses[i]] += dividedAmount;

    }

    function withdraw() {
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}