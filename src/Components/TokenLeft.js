import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import {useState} from "react";
import { ethers } from "ethers";

export default function TokenLeft() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const [tokenLeft, setTokenLeft] = useState(null);
    const [error, setError] = useState(null);
    //const contAddress = Presale_Address[chainId];
    const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;

    const { runContractFunction: getCurrentStageTokensLeft } = useWeb3Contract({
        abi: Presale_ABI,
        contractAddress: contAddress,
        functionName: "getCurrentStageTokensLeft",
        params: {},
    })


    useEffect(() => {
      if (isWeb3Enabled) {
        async function getLeft() {
          try {
            let numToken = (await getCurrentStageTokensLeft()).toString();
            if (numToken !== undefined) {
              setTokenLeft(numToken);
            } else {
              setTokenLeft('0'); // Set to 0 if undefined
            }
          } catch (error) {
            setError(error.message || "Error fetching total raised");
          }
        }
  
        getLeft();
      }
    }, [isWeb3Enabled, getCurrentStageTokensLeft]);
  
    return (
      <div>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <h1>Remaining Tokens for current stage: {tokenLeft}BLAB</h1>
        )}
      </div>
    );
  }
 