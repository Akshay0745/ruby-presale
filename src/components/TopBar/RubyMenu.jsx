import { useState } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { Button, Typography, Box } from "@material-ui/core";
import "./ohmmenu.scss";
import { useWeb3Context } from "../../hooks/web3Context";
import OhmImg from "src/assets/tokens/Ruby.png";


const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    // NOTE (appleseed): 33T token defaults to sTITANO logo since we don't have a 33T logo yet
    let tokenPath;

    switch (tokenSymbol) {
      case "Ruby":
        tokenPath = OhmImg;
        break;

    }
    const imageURL = `${host}/${tokenPath}`;
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const RUBY_ADDRESS = addresses[networkID].RUBY_ADDRESS;




  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const id = "ohm-popper";
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button id="ohm-menu-button" size="large" variant="contained" color="secondary"  onClick={addTokenToWallet("Ruby", RUBY_ADDRESS)} title="Ruby" aria-describedby={id}>
        <Typography style={{'color':'white','font-weight':'800'}}>Token</Typography>
      </Button>

      
    </Box>
  );
}

export default OhmMenu;
