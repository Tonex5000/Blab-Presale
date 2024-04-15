import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import {useState} from "react";
import { ethers } from "ethers";

export default function HardCap() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const [hardCap, setHardCap] = useState(0);
    const [error, setError] = useState(null);
    //const contAddress = Presale_Address[chainId];
    const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;

    const { runContractFunction: getCurrentStageHardcap } = useWeb3Contract({
        abi: Presale_ABI,
        contractAddress: contAddress,
        functionName: "getCurrentStageHardcap",
        params: {},
    })

    useEffect(() => {
      if (isWeb3Enabled) {
        async function getHardCap() {
          try {
            let currentHardCap = (await getCurrentStageHardcap()).toString();
            if (currentHardCap !== undefined) {
              setHardCap(ethers.utils.formatUnits(currentHardCap, "ether"));
            } else {
              setHardCap('0'); // Set to 0 if undefined
            }
          } catch (error) {
            setError(error.message || "Error fetching total raised");
          }
        }
  
        getHardCap();
      }
    }, [isWeb3Enabled, getCurrentStageHardcap]);
  
    return (
      <div>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <h1>Hard Cap For Current Stage: {hardCap}BNB</h1>
        )}
      </div>
    );

}
