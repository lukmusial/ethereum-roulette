 Roulette in Solidity
 ================
 
 A learning project to demonstrate a simple game implemented as a contract on an Ethereum blockchain.
 
 TODO:
 * prototype/learning exercise (multiplexer)
 * * multiplexer function created with test coverage
 * replace sample code with placeholders for actual contract.
 * write tests to describe happy/unhappy cases
 * integrate Oraclize - Random (challenge - how to test with testrpc)
 * build a simple DApp UI
 
 Testing on testrpc
 ===
 Does not work yet for Roulette.sol as Random is not yet available for private chains
 
 requires ethereum-bridge
 
 testrpc --mnemonic "roulette" --accounts 50
 node bridge -a 49
 
 and then replace OAR value in Roulette.sol with one provided in the log
 remove OAR from production code
 