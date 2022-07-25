import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeApproval, changeDeposit } from "../../slices/PresaleThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import PyramidOne from "../../assets/images/one.png";
import LightImage from "../../assets/images/light.png";



import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import "./presale.scss";
import { Skeleton } from "@material-ui/lab";
import { error, info } from "../../slices/MessagesSlice";



function Presale() {
  const dispatch = useDispatch();
  let isLoad = false;
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const totalDAIAmount = useSelector(state => {
    return state.app.totalDAIAmount;
  });

  const daiBalance = useSelector(state => {
    return state.account.balances && state.account.balances.dai;
  });
  const claimableBalance = useSelector(state => {
    return state.account.claim && state.account.claim.claimableAmount;
  });

  const presaleStartTime = useSelector(state => {
    return state.app.presaleStartTime;
  });
  const currentTime = new Date();

  let date;
  if (presaleStartTime != undefined) {
    date = (parseInt(currentTime / 1000) - presaleStartTime) / 172800;
  } else {
    date = 0;
  }
  let datebonus;
  if (date < 10) {
    datebonus = 10 - parseInt(date);
  } else {
    datebonus = 0;
  }
  let isAddedWhitelist = useSelector(state => {
    return state.account.presale && state.account.presale.isWhiteList;
  });
  let Whitelist;
  if (isAddedWhitelist == true) {
    Whitelist = "Yes";
  } else {
    Whitelist = "No";
  }

  const tokensRemain = useSelector(state => {
    return state.app.getRubyTokensLeft;
  });
  const tokenSold = useSelector(state => {
    return state.app.totalTokenSold;
  });

  const isPresaleOpen = useSelector(state => {
    return state.app.isPresaleOpen;
  });

  if (!isLoad && daiBalance && (Number(daiBalance) - Number(daiBalance) < 0)) {
    dispatch(info("You got not enough DAI."));
    isLoad = true;
  }
  const setMax = () => {
    setQuantity(Number.parseFloat(daiBalance).toFixed(3));
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeDeposit = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("app is loading"));
    }
    if (action === "presale" && 0.1 > Number(quantity)) {
      return dispatch(error("The min amount is 0.1 DAI"));
    }
    if (action === "presale" && isAddedWhitelist == false) {
      return dispatch(error("You have to register to whitelist"));
    }
    await dispatch(changeDeposit({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };


  const presaleAllowance = useSelector(state => {
    return state.account.presale && state.account.presale.presaleAllowance;
  });



  return (
    <div id="dashboard-view">
      
      <>
        <div className="presale-page-custom">
          <Paper className={`ohm-card`}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
              <img className="highlight-right wow animated" src={LightImage}   style={{visibility: "visible"}} />
            <img className="highlight-left wow animated" src={LightImage}   style={{visibility: "visible"}} />
              <div className="presale-header">
                <h1>Presale</h1>
                <p>Presale open and whitelist is needed to buy. RUBY can be claimed on launch!</p>
              
              </div>
                <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
                  <Box alignItems="center" justifyContent="flex-start" flexDirection="column" display="flex">
                    {address && isPresaleOpen == true ? (
                      <>
                        <div className="stake-top-metrics data-row left-side">
                          <Typography className="presale-items"><span className="presale-text">Total Deposited Amount : </span></Typography>
                          <Typography className="presale-items" style={{ marginLeft: "16px" }}> {totalDAIAmount} DAI </Typography>
                        </div>
                        <div className="stake-top-metrics data-row left-side">
                          <Typography className="presale-items"><span className="presale-text">Whitelisted : </span></Typography>
                          <Typography className="presale-items" style={{ marginLeft: "16px" }}> {Whitelist} </Typography>
                        </div>
                        <div className="stake-top-metrics data-row left-side">
                          <Typography className="presale-items"><span className="presale-text">Min Bonus Amount : </span></Typography>
                          <Typography className="presale-items" style={{ marginLeft: "16px" }}> {datebonus} % </Typography>
                        </div>
                        <Box alignItems="center" justifyContent="flex-start" flexDirection="column" display="flex" style={{ marginBottom: "16px", marginLeft: "0", marginRight: "auto" }}>
                          <Typography style={{ marginTop: "16px" }}>Max Bonus Amount : <b>
                            {datebonus + 10}</b> %</Typography>
                        </Box>
                        <div className="stake-top-metrics data-row left-side">
                          <Typography className="presale-items"><span className="presale-text">Ruby Price : </span></Typography>
                          <Typography className="presale-items" style={{ marginLeft: "16px" }}>1 DAI</Typography>
                        </div>

                        <div className="stake-top-metrics data-row left-side">
                          <Typography className="presale-items"><span className="presale-text">Your DAI balance</span></Typography>
                          <Typography className="presale-items" style={{ marginLeft: "16px" }}>{Number.parseFloat(daiBalance).toFixed(1)} DAI</Typography>
                        </div>
                        <div className="stake-top-metrics data-row left-side">
                          <Typography className="presale-items"><span className="presale-text">Your Claimable RUBY :</span></Typography>
                          <Typography className="presale-items" style={{ marginLeft: "16px" }}> {claimableBalance ? Number.parseFloat(claimableBalance * 1000000000).toFixed(0) : 0} RUBY </Typography>
                        </div>
                        <Box item xs={12} sm={6} md={6} lg={6} style={{ marginLeft: "0", marginRight: "auto" }}>
                          {address ? (
                            Number(presaleAllowance) <= 0 ? (
                              <Box className="help-text">
                                <Typography variant="body1" className="stake-note" color="textSecondary">
                                  <>
                                    First time deposit <b>DAI</b> tokens?
                                    <br />
                                    Please approve Contract to use your <b>DAI tokens</b> for buying.
                                  </>
                                </Typography>
                                <Button
                                  className="stake-button"
                                  variant="contained"
                                  color="primary"
                                  style={{ marginTop: "16px", marginLeft: "0", marginRight: "auto", border: "2px solid #FF4C4F", borderRadius: "0px" }}
                                  disabled={isPendingTxn(pendingTransactions, "approve_buying")}
                                  onClick={() => {
                                    onSeekApproval("DAI");
                                  }}
                                >
                                  {txnButtonText(pendingTransactions, "approve_buying", "Approve")}
                                </Button>
                              </Box>
                            ) : (
                              <FormControl className="ohm-input" variant="outlined" color="primary">
                                <InputLabel htmlFor="amount-input"></InputLabel>
                                <OutlinedInput
                                  id="amount-input"
                                  type="number"
                                  placeholder="Enter an amount"
                                  className="stake-input"
                                  value={quantity}
                                  width="100%"
                                  style={{ marginTop: "16px", marginLeft: "0", marginRight: "auto", borderRadius: "0px" }}
                                  onChange={e => setQuantity(e.target.value)}
                                  labelWidth={0}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Button style={{ fontWeight: "200" }} variant="text" onClick={setMax} color="inherit">
                                        Max
                                      </Button>
                                    </InputAdornment>
                                  }
                                />
                                <div>
                                  <Button
                                    className="stake-button"
                                    variant="contained"
                                    color="primary"
                                    disabled={isPendingTxn(pendingTransactions, "deposit")}
                                    style={{ marginTop: "16px", marginLeft: "0", marginRight: "auto", border: "2px solid #FF4C4F", borderRadius: "0px" }}
                                    onClick={() => {
                                      onChangeDeposit("presale");
                                    }}
                                  >
                                    {txnButtonText(pendingTransactions, "deposit", "BUY")}
                                  </Button>
                                  <Button
                                    className="stake-button"
                                    variant="contained"
                                    color="primary"
                                    disabled={isPendingTxn(pendingTransactions, "deposit")}
                                    style={{ marginTop: "16px", marginLeft: "20px", marginRight: "auto", border: "2px solid #FF4C4F", borderRadius: "0px" }}
                                    onClick={() => {
                                      onChangeDeposit("presale");
                                    }}
                                  >
                                    <a target="blank" className="swap" href="https://app.uniswap.org/#/swap?chain=rinkeby&inputCurrency=ETH&outputCurrency=0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa">Swap for DAI</a>

                                  </Button>
                                </div>
                                <Box alignItems="center" justifyContent="flex-start" flexDirection="column" display="flex" style={{ marginBottom: "16px", marginLeft: "0", marginRight: "auto" }}>
                                  <Typography style={{ marginTop: "16px" }}>Current Bonus Amount : <b>
                                    {quantity > 100000 ?
                                      datebonus + 10 :
                                      quantity > 10000 ?
                                        datebonus + 8 :
                                        quantity > 1000 ?
                                          datebonus + 5 :
                                          quantity > 100 ?
                                            datebonus + 3 :
                                            datebonus
                                    }</b> %
                                  </Typography>
                                </Box>
                                
                                <Box alignItems="center" justifyContent="flex-start" flexDirection="column" display="flex" style={{ marginBottom: "16px", marginLeft: "0", marginRight: "auto" }}>
                                  <Typography style={{ marginTop: "16px" }}>You will get <b>
                                    {quantity > 100000 ?
                                      Number.parseFloat(quantity * (100 + datebonus + 10) / 100).toFixed(1) :
                                      quantity > 10000 ?
                                        Number.parseFloat(quantity * (100 + datebonus + 8) / 100).toFixed(1) :
                                        quantity > 1000 ?
                                          Number.parseFloat(quantity * (100 + datebonus + 5) / 100).toFixed(1) :
                                          quantity > 100 ?
                                            Number.parseFloat(quantity * (100 + datebonus + 3) / 100).toFixed(1) :
                                            Number.parseFloat(quantity * (100 + datebonus) / 100).toFixed(1)
                                    }</b> RUBY
                                  </Typography>
                                </Box>

                              </FormControl>
                            )
                          ) : (
                            <Skeleton width="150px" />
                          )}

                        </Box>
                      </>

                    ) : (
                      <>
                        <Typography style={{ marginTop: "16px" }}>Presale has not started yet</Typography>
                      </>
                    )}
                  </Box>
                </div>
              </Grid>

            </Grid>
          </Paper>
          <div className="protocol-image">
            <div className="pyramid tiq new">
            <img src={PyramidOne} />                          
            </div>
          </div>
          
        </div>
      </>
    </div>
  );
}

export default Presale;
