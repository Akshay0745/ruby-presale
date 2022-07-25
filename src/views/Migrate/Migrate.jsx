import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeClaimV1 } from "../../slices/ClaimThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Zoom,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { trim } from "../../helpers";
import "./claim.scss";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";
import gif from '../../assets/evll.gif'


function Migrate() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const pbhdBalance = useSelector(state => {
    return state.account.balances && state.account.balances.pbhd;
  });
  const setMax = () => {
    setQuantity(pbhdBalance);
  };
  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };
  const claimAllowance = useSelector(state => {
    return state.account.claim && state.account.claim.claimAllowance;
  });
  const claimableAmount = useSelector(state => {
    return state.account.claim && state.account.claim.claimableAmount;
  });
  const totalPurchasedAmount = useSelector(state => {
    return state.account.claim && state.account.claim.totalPurchasedAmount;
  });
  const claimedAmount = useSelector(state => {
    return state.account.claim && state.account.claim.claimedAmount;
  });

  const bptBalance = useSelector(state => {
    return state.account.balances && state.account.balances.bpt;
  });

  const isClaimOpen = useSelector(state => {
    return state.app.isClaimOpen;
  });

  const isInvestor = useSelector(state => {
    return state.account.presale && state.account.presale.isInvestor;
  });

  const onChangeClaimV1 = async action => {
    // eslint-disable-next-line no-restricted-globals
    // quantity = 10;
    // if (isNaN(quantity) || quantity === 0 || quantity === "") {
    //   // eslint-disable-next-line no-alert
    //   return dispatch(error("Please enter a value!"));
    // }

    // // 1st catch if quantity > balance
    // let gweiValue = ethers.utils.parseUnits(quantity, "gwei");

    // if (action === "claim" && gweiValue.gt(ethers.utils.parseUnits(pbhdBalance, "gwei"))) {
    //   return dispatch(error("You cannot claim more than your pBHD balance."));
    // }
    await dispatch(changeClaimV1({ address, action, value: "", provider, networkID: chainID }));
  };
  const hasAllowance = useCallback(
    token => {
      if (token === "pbhd") return claimAllowance > 0;
      return 0;
    },
    [claimAllowance],
  );
  const isAllowanceDataLoading = claimAllowance == null;
  return (
    <div id="dashboard-view">
      <div className="presale-header">
        <h1>Migrate V1</h1>
        <p> Only V1 investors can claim. Migrate is {isClaimOpen ? 'active' : 'waiting'} </p>
      </div>
      <Paper className="ref-card">
        <img src={gif} style={{width: "100%", height: "auto", borderRadius: "24px"}} />
      </Paper>
      <div style={{marginBottom: "16px"}} />
      <Paper className={`ohm-card`}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Migrate V1</Typography>
            </div>
          </Grid>
        </Grid>
        {/* <Grid item>
          <div className="stake-top-metrics" style={{marginBottom: "18px"}}>
            <Typography className="presale-items">20% each week at the public launch.</Typography>
            <Typography className="presale-items">So after the Presale <span style={{color: "#11d59e"}}>20%</span>.</Typography>
          </div>
        </Grid>
        {totalPurchasedAmount && 
          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
              <Typography className="presale-items">Total Purchased Amount:</Typography>
              <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#11d59e"}}>{totalPurchasedAmount / 5} RUBY</span></Typography>
            </div>
          </Grid>
        } */}

          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
              <Typography className="presale-items">Your RUBY Balance:</Typography>
              <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#11d59e"}}>{bptBalance ? Number.parseFloat(bptBalance).toFixed(3) : 0} RUBY</span></Typography>
            </div>
          </Grid>

          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
              <Typography className="presale-items">V1 Investor:</Typography>
              <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#11d59e"}}>{isInvestor ? "Yes" : "No" }</span></Typography>
            </div>
          </Grid>

        {claimableAmount && 
          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
              <Typography className="presale-items">Claimable Amount:</Typography>
              <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#11d59e"}}>{claimableAmount} RUBY</span></Typography>
            </div>
          </Grid>
        }
        <Grid item>
          <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
            <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">

              {isAllowanceDataLoading ? (
                <Skeleton width="45%" />
              )  : /* address && hasAllowance("pbhd") ? */ (
                <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                  {/* <Typography style={{marginTop: "16px"}}>20% each week at the public launch.</Typography> */}
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    style={{marginTop: "16px"}}
                    disabled={isPendingTxn(pendingTransactions, "claim")}
                    onClick={() => {
                      onChangeClaimV1("claim");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "claim", "Claim")}
                  </Button>
                </Box>
              ) /* : (
                <Box>
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    disabled={isPendingTxn(pendingTransactions, "approve_claim")}
                    onClick={() => {
                      onSeekApproval("pbhd");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "approve_claim", "Approve")}
                  </Button>
                </Box>
              ) */ } 
            </Box>
          </div>
        </Grid>
      </Paper>
    </div>
  );
}

export default Migrate;
