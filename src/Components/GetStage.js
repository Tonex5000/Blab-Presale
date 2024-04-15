import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import {useState} from "react";
//import { ethers } from "ethers";

export default function Stage() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const [stage, setStage] = useState(0);
    const [error, setError] = useState(null);
    const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;

    const { runContractFunction: getCurrentStage } = useWeb3Contract({
        abi: Presale_ABI,
        contractAddress: contAddress,
        functionName: "getCurrentStage",
        params: {},
    })

    useEffect(() => {
      if (isWeb3Enabled) {
        async function getStage() {
          try {
            let stage = (await getCurrentStage()).toString();
            if (stage !== undefined) {
              setStage(stage);
            } else {
              setStage('0'); // Set to 0 if undefined
            }
          } catch (error) {
            setError(error.message || "Error fetching total raised");
          }
        }
  
        getStage();
      }
    }, [isWeb3Enabled, getCurrentStage]);


  return (
    <div>
      {error ? (<p>Error: {error}</p>) : (<h1>Current Stage: {stage}</h1>)}
    </div>
  );
} 



