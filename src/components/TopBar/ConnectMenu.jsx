import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { switchNetwork} from "src/helpers/SwitchNetworks";

function ConnectMenu({ theme }) {
  const { connect, disconnect, connected, web3, chainID, vchainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [chainId, setChainID] = useState(vchainID);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = "Connect Wallet";
  let clickFunc = connect;


  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (chainId !== 1) {
    buttonText = "Switch to ETH";
    clickFunc = switchNetwork;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
  }

  const open = Boolean(anchorEl);

  const primaryColor = theme === "light" ? "#F8CC82" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? "hovered-button" : "");



  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
    setChainID(vchainID);
  }, [web3, connected, vchainID]);

  return (
    <div
      onMouseEnter={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      onMouseLeave={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      className="wallet-menu"
      id="wallet-menu"
    >
      <Button
        className={buttonStyles}
        variant="contained"
        color="secondary"
        size="large"
        style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
        onClick={clickFunc}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {buttonText}

      </Button>

    </div>
  );
}

export default ConnectMenu;
