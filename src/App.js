import React, { useState, useEffect } from "react";
import "./App.css";
import {
  walletOfOwner,
  mint,
  claimRewards,
  getAvaxBalance,
  contractData,
} from "./components/blockchainFunctions";

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState("");
  const [userTokens, setUserTokens] = useState([]);
  const [rewards, setRewards] = useState("");
  const [supply, setSupply] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    console.log("hola");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        setUserAddress(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMint = async () => {
    setIsLoading(true);
    let receipt = await mint();
    if (receipt) {
      console.log(receipt);
      getUserData();
    }
    setIsLoading(false);
  };

  const handleClaim = async (id) => {
    setIsLoading(true);
    let receipt = await claimRewards(id);
    if (receipt) {
      getUserData();
      console.log(receipt);
    }
    setIsLoading(false);
  };

  const getUserNFTs = async () => {
    if (userAddress) {
      let tokens = await walletOfOwner(userAddress);
      if (tokens) {
        setUserTokens(tokens);
        console.log(tokens);
      }
    }
  };

  const getUserBalance = async () => {
    if (userAddress) {
      let balance = await getAvaxBalance(userAddress);
      setUserBalance(balance);
    }
  };

  const getContractData = async () => {
    let result = await contractData();
    if (result) {
      setRewards(result.totalRewards);
      setSupply(result.supply);
      console.log(result, "rewards");
    }
  };

  const getUserData = () => {
    getUserNFTs();
    getUserBalance();
    getContractData();
  };

  useEffect(() => {
    getUserData();
  }, [userAddress]);

  return (
    <div className="App">
      {userAddress ? (
        <div className="mint-block">
          <h3>{userAddress}</h3>
          <h3>Balance: {userBalance} AVAX</h3>
          <h4>Total Rewards Distributed: {rewards} AVAX</h4>
          <h4>Total Minted: {supply} NFTs</h4>
          <button disabled={isLoading} onClick={handleMint}>
            Mint
          </button>

          <div className="nft-block">
            {userTokens.length != 0 ? (
              <>
                <h3>Your NFTs</h3>
                {userTokens.map((el, index) => {
                  return (
                    <div key={index} className="nft-card">
                      <h4>Token Id: {el.tokenId.toString()}</h4>
                      <h5>Tier: {el.tier.toString()}</h5>
                      <h5>
                        Pending Rewards:{" "}
                        {Number(el.rewards / 10 ** 18).toFixed(4)} AVAX
                      </h5>
                      <button
                        disabled={isLoading}
                        onClick={() => handleClaim(el.tokenId)}
                      >
                        Claim Rewards
                      </button>
                    </div>
                  );
                })}
              </>
            ) : (
              <h3>You don't have any NFT, mint one for 1.5 AVAX</h3>
            )}
          </div>
        </div>
      ) : (
        <button onClick={connectWallet}>connect wallet</button>
      )}
    </div>
  );
}

export default App;
