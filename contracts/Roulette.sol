pragma solidity ^0.4.11;

//import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
import "./usingOraclize.sol"; //cannot use github for truffle

//planned logic v0.1
//a simplified 1-round game
//owner creates a contract and sets the participant number limit
//participants call in and contribute a value to the contract as part of the transaction
//when the number of participants hits the pool size, game will trigger
//for each participant a 1/6 probability 'shot' is made, and a value of 0 eliminates the player
//if everybody is shot, proceeds go to the owner
//survivors can withdraw a proportional fraction of the proceeds

//planned logic v0.2
//a game where in each turn participants can withdraw with a fraction of the pool
//a preset value to add to the pool
contract Roulette is usingOraclize {

    event newRandomNumber(bytes);
    //uint nrOfParticipants = 6; //hardcoded for now

    function Roulette() {
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        oraclize_setProof(proofType_Ledger);
        update();
    }

    function __callback(bytes32 _queryId, string _result, bytes _proof) oraclize_randomDS_proofVerify(_queryId, _result, _proof)
    {
        if (msg.sender != oraclize_cbAddress()) throw;

        newRandomNumber(bytes(_result));
        // do stuff
    }

    function update() payable {
        uint N = 7; // number of random bytes we want the datasource to return
        uint delay = 0;
        uint callbackGas = 200000;
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas);
    }

}