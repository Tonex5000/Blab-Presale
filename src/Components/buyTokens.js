import React, { useEffect } from 'react';
import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Price() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;
  const [numberOfTokens, setNumberOfTokens] = useState(0);

  const { runContractFunction: buyTokens } = useWeb3Contract({
    abi: Presale_ABI,
    contractAddress: contAddress,
    functionName: "buyTokens",
    params: { numberOfTokens },
    msgValue: price * numberOfTokens,
  });

  const { runContractFunction: getCurrentStagePrice } = useWeb3Contract({
    abi: Presale_ABI,
    contractAddress: contAddress,
    functionName: "getCurrentStagePrice",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      async function getPrice() {
        try {
          let currentPrice = (await getCurrentStagePrice()).toString();
          setPrice(currentPrice || '0'); // Set to '0' if undefined
        } catch (error) {
          setError(error.message || "Error fetching total raised");
        }
      }
      getPrice();
    }
  }, [isWeb3Enabled, getCurrentStagePrice]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    toast.success('Transaction Complete!');
  };

  const handleError = (error) => {
    console.error("Transaction failed:", error);
    let errorMessage = "An error occurred during the transaction. Please try again.";
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  // Toast notification logic
  useEffect(() => {
    if (!toast.isActive(13, "friendRequest")) {
      console.log("first time running");
      toast('User does not exist', {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        type: "error",
        toastId: 13
      });
    }
  }, []);

  return (
    <div>
      {error ? (
        <>
          <div>
            <p>Error: {error}</p>
            <h1>Current Stage Price: {ethers.utils.formatUnits(price, "ether")}BNB</h1>
            <h1>Buy Tokens</h1>
            <input type="number" placeholder="Number of Tokens" onChange={(e) => setNumberOfTokens(parseInt(e.target.value))} />
            <button onClick={async () => {
              try {
                await buyTokens({
                  numberOfTokens,
                  onSuccess: handleSuccess,
                  onError: handleError,
                });
              } catch (error) {
                console.error("Error buying tokens:", error);
                toast.error('Error buying tokens');
              }
            }}>Buy Now</button>
          </div>
          {console.log("Invalid number of token was entered!")}
        </>
      ) : (
        <div>
          <h1>Buy Tokens</h1>
          <input type="number" placeholder="Number of Tokens" onChange={(e) => setNumberOfTokens(parseInt(e.target.value))} />
          <button onClick={async () => {
            try {
              await buyTokens({
                numberOfTokens,
                onSuccess: handleSuccess,
                onError: handleError,
              });
            } catch (error) {
              console.error("Error buying tokens:", error);
              toast.error('Error buying tokens');
            }
          }}>Buy Now</button>
          <ToastContainer containerId={"friendRequest"} />
        </div>
      )}
    </div>
  );
} 

