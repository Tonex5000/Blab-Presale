import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import TokenLeft from "./TokenLeft";
import Stage from "./GetStage";
import Price from "./buyTokens";
import HardCap from "./GetHardCap";
import TotalRaised from "./TotalRaised";
import Claim from  "./Claim";

export default function Home() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    chainId,
  } = useMoralis();
  const [showMessage, setShowMessage] = useState(false);
  const [preferredChainId, setPreferredChainId] = useState("0x38");
  const [isConnecting, setIsConnecting] = useState(false);

  // Call enableWeb3 when Connect button is clicked
  const handleConnectClick = async () => {
    setIsConnecting(true);
    await enableWeb3();
    window.localStorage.setItem("connected", "injected");
    setIsConnecting(false);
  };

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
    console.log("Connected chainId:", chainId);
    if (account && chainId) {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [chainId, account]);

  const switchToPreferredNetwork = async () => {
    try {
      if (chainId !== preferredChainId) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x38",
            chainName: "Binance Smart Chain Mainnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
          }],
        });
        
        await Moralis.switchNetwork("0x38");
        console.log(`Switched to preferred network`);
      } else {
        console.log("Already connected to the preferred network");
      }
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={handleConnectClick}
          disabled={isWeb3Enabled || isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </button>
      )}
      {showMessage ? (
        chainId === "0x38" ? (
          <div>
            <Stage />
            <Price />
            <HardCap />
            <TokenLeft />
            <TotalRaised />
            <Claim />
          </div>
        ) : (
          <button onClick={switchToPreferredNetwork}>Switch Network</button>
        )
      ) : null}
    </div>
  );
}
