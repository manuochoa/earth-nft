import React, { useState, useEffect } from "react";
import "./App.css";
import {
  walletOfOwner,
  mint,
  claimRewards,
  getAvaxBalance,
} from "./components/blockchainFunctions";

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState("");
  const [userTokens, setUserTokens] = useState([]);
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

  const getUserData = () => {
    getUserNFTs();
    getUserBalance();
  };

  useEffect(() => {
    getUserData();
  }, [userAddress]);

  return (
    <div className="App">
      mint text
      {userAddress ? (
        <div className="mint-block">
          <h3>{userAddress}</h3>
          <h3>Balance: {userBalance} AVAX</h3>
          <button disabled={isLoading} onClick={handleMint}>
            Mint
          </button>

          <div className="nft-block">
            {userTokens.map((el, index) => {
              return (
                <div key={index} className="nft-card">
                  <h3>Token Id: {el.tokenId.toString()}</h3>
                  <h4>Tier: {el.tier.toString()}</h4>
                  <h4>
                    Pending Rewards: {Number(el.rewards / 10 ** 18).toFixed(4)}{" "}
                    AVAX
                  </h4>
                  <button
                    disabled={isLoading}
                    onClick={() => handleClaim(el.tokenId)}
                  >
                    Claim Rewards
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <button onClick={connectWallet}>connect wallet</button>
      )}
    </div>
  );
}

export default App;
