const MoneyBack = artifacts.require("./MoneyBack.sol");

contract('MoneyBack', function(accounts) {

  const amount = Math.pow(10,16)*88;
  const account_sponsor = accounts[0];
  const account_one = accounts[1];
  const account_two = accounts[2];

  function humanReadableBalance(account) {
    return Math.floor(web3.eth.getBalance(account).toNumber()/Math.pow(10,16));
  }

  it("should not allow to withdraw twice", function(){
      var moneyback;

      var account_one_starting_balance = humanReadableBalance(account_one);
      var account_two_starting_balance = humanReadableBalance(account_two);
      var account_sponsor_starting_balance = humanReadableBalance(account_sponsor);
      var account_one_ending_balance;
      var account_two_ending_balance;
      var account_sponsor_ending_balance;

      var amountToVerify = amount / 2 / Math.pow(10,16);
      var amountFromSponsor = 1 + amount / Math.pow(10,16); //adding 1 to compensate for contributed transaction wei

      return MoneyBack.deployed().then(function(instance) {
        moneyback = instance;
        return moneyback.multiplex.sendTransaction([account_one, account_two], {from: account_sponsor, value: amount});
      }).then(function() {
        return moneyback.withdraw.sendTransaction({from:account_one});
      }).then(function() {
        return moneyback.withdraw.sendTransaction({from:account_one});
      }).then(function() {
        return moneyback.withdraw.sendTransaction({from:account_two});
      }).then(function() {
        account_one_ending_balance = humanReadableBalance(account_one);
        account_two_ending_balance = humanReadableBalance(account_two);

        assert.approximately(account_one_ending_balance, account_one_starting_balance + amountToVerify, 1, "Amount wasn't correctly sent to the account 2");
        assert.approximately(account_two_ending_balance, account_two_starting_balance + amountToVerify, 1, "Amount wasn't correctly sent to the account 1");
      });
  });

  it("should not affect account but for computed gas if sender is receiver", function() {
      var moneyback;

      var account_sponsor_starting_balance = humanReadableBalance(account_sponsor);
      var account_sponsor_ending_balance;

      return MoneyBack.deployed().then(function(instance) {
        moneyback = instance;
        return moneyback.multiplex.sendTransaction([account_sponsor], {from: account_sponsor, value: amount});
      }).then(function() {
        return moneyback.withdraw.sendTransaction({from:account_sponsor});
      }).then(function() {
        account_sponsor_ending_balance = humanReadableBalance(account_sponsor);

        assert.approximately(account_sponsor_ending_balance, account_sponsor_starting_balance, 1, "Balance should be unaffected");
      });
  });

  it("should do nothing if account not in withdrawable list", function() {
    var moneyback;

    var account_one_starting_balance = humanReadableBalance(account_one);
    var account_sponsor_starting_balance = humanReadableBalance(account_sponsor);
    var account_one_ending_balance;
    var account_sponsor_ending_balance;

    var amountToVerify = amount / Math.pow(10,16);
    var amountFromSponsor = amount / Math.pow(10,16);

    return MoneyBack.deployed().then(function(instance) {
      moneyback = instance;
      return moneyback.multiplex.sendTransaction([], {from: account_sponsor, value: amount});
    }).then(function() {
      return moneyback.withdraw.sendTransaction({from:account_one});
    }).then(function() {
      account_one_ending_balance = humanReadableBalance(account_one);
      account_sponsor_ending_balance = humanReadableBalance(account_sponsor);

      assert.approximately(account_one_ending_balance, account_one_starting_balance, 1, "Amount was incorrectly sent to unexpected receiver");
      assert.approximately(account_sponsor_ending_balance, account_sponsor_starting_balance, 1, "Amount was taken from sponsor");
    });
  });

  it("should forward to a single account", function () {
    var moneyback;

    var account_one_starting_balance = humanReadableBalance(account_one);
    var account_sponsor_starting_balance = humanReadableBalance(account_sponsor);
    var account_one_ending_balance;
    var account_sponsor_ending_balance;

    var amountToVerify = amount / Math.pow(10,16);
    return MoneyBack.deployed().then(function(instance) {
      moneyback = instance;
      return moneyback.multiplex.sendTransaction([account_one], {from: account_sponsor, value: amount});
    }).then(function() {
      return moneyback.withdraw.sendTransaction({from:account_one});
    }).then(function() {
      account_one_ending_balance = humanReadableBalance(account_one);
      account_sponsor_ending_balance = humanReadableBalance(account_sponsor);

      assert.approximately(account_one_ending_balance, account_one_starting_balance + amountToVerify, 1, "Amount wasn't correctly sent to the account 1");
      assert.approximately(account_sponsor_ending_balance, account_sponsor_starting_balance - amountToVerify, 1, "Amount wasn't correctly taken from sponsor");
    });
  });

  it("should divide coins between designated accounts", function() {
    var moneyback;

    var account_one_starting_balance = humanReadableBalance(account_one);
    var account_two_starting_balance = humanReadableBalance(account_two);
    var account_sponsor_starting_balance = humanReadableBalance(account_sponsor);
    var account_one_ending_balance;
    var account_two_ending_balance;
    var account_sponsor_ending_balance;

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

      assert.approximately(account_one_ending_balance, account_one_starting_balance + amountToVerify, 1, "Amount wasn't correctly sent to the account 2");
      assert.approximately(account_two_ending_balance, account_two_starting_balance + amountToVerify, 1, "Amount wasn't correctly sent to the account 1");
      assert.approximately(account_sponsor_ending_balance, account_sponsor_starting_balance - amountFromSponsor, 1, "Amount wasn't correctly taken from sponsor");
    });
  });
});
