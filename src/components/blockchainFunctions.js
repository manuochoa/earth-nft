import { ethers } from "ethers";
import { abi } from "./contractAbi";

const NODE_URL = "https://api.avax-test.network/ext/bc/C/rpc";
// let provider = new ethers.providers.Web3Provider(window.ethereum);
let provider = new ethers.providers.JsonRpcProvider(NODE_URL);
// let signer = provider.getSigner(0);

let NFTAddress = "0x088D2100BE9EFca9Dd4a05B7765dceE668a16a1e";

let NFTContract = new ethers.Contract(NFTAddress, abi, provider);

export const walletOfOwner = async (address) => {
  try {
    let ids = await NFTContract.walletOfOwner(address);
    let tokens = await Promise.all(
      ids.map(async (el) => {
        let details = await NFTContract.detailsByTokenId(el);
        let rewards = await NFTContract.getRewards(el);

        return { tokenId: el, rewards: rewards.amount, tier: details.tier };
      })
    );

    return tokens;
  } catch (error) {
    console.log(error, "walletOfOwner");
  }
};

export const mint = async () => {
  try {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner(0);

    let contractInstance = new ethers.Contract(NFTAddress, abi, signer);

    const value = ethers.utils.parseUnits("1.5", "ether");

    let tx = await contractInstance.mint({ value, gasLimit: 500000 });

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "mint");
  }
};

export const claimRewards = async (id) => {
  try {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner(0);

    let contractInstance = new ethers.Contract(NFTAddress, abi, signer);

    let tx = await contractInstance.claimRewards(id);

    let receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.log(error, "claimRewards");
  }
};

export const getAvaxBalance = async (address) => {
  try {
    let balance = await provider.getBalance(address);

    return Number(balance / 10 ** 18).toFixed(4);
  } catch (error) {
    console.log(error, "getAvaxBalance");
  }
};
