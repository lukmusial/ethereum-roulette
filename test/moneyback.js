var MoneyBack = artifacts.require("./MoneyBack.sol");

contract('MoneyBack', function(accounts) {

    //TODO: add a test using await style

  function humanReadableBalance(account) {
    return Math.ceil(web3.eth.getBalance(account).toNumber()/Math.pow(10,16));
  }

  it("should divide coins between designated accounts", function() {
    var moneyback;

    var account_sponsor = accounts[0];
    var account_one = accounts[1];
    var account_two = accounts[2];

    var account_one_starting_balance = humanReadableBalance(account_one);
    console.log(account_one_starting_balance);
    var account_two_starting_balance = humanReadableBalance(account_two);
    var account_sponsor_starting_balance = humanReadableBalance(account_sponsor);
    console.log(account_two_starting_balance);
    var account_one_ending_balance;
    var account_two_ending_balance;
    var account_sponsor_ending_balance;

    var amount = Math.pow(10,16)*88;
    var amountToVerify = amount / 2 / Math.pow(10,16);
    var amountFromSponsor = 1 + amount / Math.pow(10,16); //adding 1 to compensate for contributed transaction wei

    return MoneyBack.deployed().then(function(instance) {
      moneyback = instance;
      return moneyback.multiplex.sendTransaction([account_one, account_two], {from: account_sponsor, value: amount});
    }).then(function() {
      return moneyback.withdraw.sendTransaction({from:account_one});
    }).then(function() {
      return moneyback.withdraw.sendTransaction({from:account_two});
    }).then(function() {
      account_one_ending_balance = humanReadableBalance(account_one);
      account_two_ending_balance = humanReadableBalance(account_two);
      account_sponsor_ending_balance = humanReadableBalance(account_sponsor);
      console.log(account_one_ending_balance);
      console.log(account_two_ending_balance);

      assert.equal(account_two_ending_balance, account_two_starting_balance + amountToVerify, "Amount wasn't correctly sent to the account 1");
      assert.equal(account_one_ending_balance, account_one_starting_balance + amountToVerify, "Amount wasn't correctly sent to the account 2");
      assert.equal(account_sponsor_ending_balance, account_sponsor_starting_balance - amountFromSponsor, "Amount wasn't correctly taken from sponsor");
    });
  });
});
