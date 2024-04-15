import { useWeb3Contract } from "react-moralis";
import { Presale_ABI, Presale_Address } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Claim() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const contAddress = chainId in Presale_Address ? Presale_Address[chainId][0] : null;

    const { runContractFunction: withdrawClaimForCurrentStage } = useWeb3Contract({
        abi: Presale_ABI,
        contractAddress: contAddress,
        functionName: "withdrawClaimForCurrentStage",
        params: {},
    });

  const handleWithdrawClaim = async () => {
    try {
        await withdrawClaimForCurrentStage();
        console.log("Claim withdrawn successfully");
    } catch (error) {
        if (error.message.includes("No claim available")) {
            console.log("Nothing to claim");
            // Display message to user indicating there is nothing to claim
        } else {
            console.error("Failed to withdraw claim:", error);
            // Handle other errors (display to user, etc.)
        }
    }
  };

  const handleSuccess = () => {
    toast.success('Transaction Complete!');
};

  const handleError = (error) => {
    console.error("Transaction failed:", error);
  
    // Extract the error message from the error object
    let errorMessage = "An error occurred during the transaction. Please try again.";
  
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
  
    // Display the error message using toast notification
    toast.error(errorMessage);
  };
  
       useEffect(() => {
        if (isWeb3Enabled) {
            // Optionally, you can call withdrawClaimForCurrentStage() here directly if you want to trigger it immediately on component mount.
        }
    }, [isWeb3Enabled]); 

    return (
        <div>
            {contAddress ? (
                <button onClick={async () => {
                    try {
                      await handleWithdrawClaim({
                        onSuccess: handleSuccess,
                        onError: handleError,
                      });
                    } catch (error) {
                      console.error("Error buying tokens:", error);
                      toast.error('No BLAB to Claim');
                    }
                  }}>Withdraw Claim</button>
            ) : (
                <div>No BLAB to Claim</div>
            )}

            <ToastContainer />
        </div>
    );
}
 