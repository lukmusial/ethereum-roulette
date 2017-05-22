var MoneyBack = artifacts.require("./MoneyBack.sol");

contract('MoneyBack', function(accounts) {

  it("should send coin correctly", function() {
    var meta;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance = web3.eth.getBalance(account_one).toNumber();
    console.log(account_one_starting_balance);
    var account_two_starting_balance = web3.eth.getBalance(account_two).toNumber();
    console.log(account_two_starting_balance);
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MoneyBack.deployed().then(function(instance) {
      meta = instance;
      return meta.multiplex.call(accounts);
    }).then(function() {
      return meta.withdraw.call(account_one);
    }).then(function() {
      return meta.withdraw.call(account_two)
    }).then(function() {
      account_one_ending_balance = web3.eth.getBalance(account_one).toNumber();
      account_two_ending_balance = web3.eth.getBalance(account_two).toNumber();
      console.log(account_one_ending_balance);
      console.log(account_two_ending_balance);

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
});
