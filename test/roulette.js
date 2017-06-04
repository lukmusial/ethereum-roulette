const MoneyBack = artifacts.require("./Roulette.sol");

contract('Roulette', function(accounts) {

  it("should test for event", function(){
      var roulette;

      var account_one_starting_balance = humanReadableBalance(account_one);
      var account_one_ending_balance;
      return Roulette.deployed().then(function(instance) {
        roulette = instance;
        return roulette.send({from: accounts[0], value: web3.toWei(5, 'ether')}).then((result) => {
            assert.equal(result.logs[0].event, "EventName", "Expected event") //dummy assertion for now
        });
      }).then(function() {
        account_one_ending_balance = web3.toWei(5, 'ether') + account_one_starting_balance

        assert.approximately(account_one_ending_balance, account_one_starting_balance, "dummy");
      });
  });


});
