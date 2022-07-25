import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeClaim } from "../../slices/ClaimThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
} from "@material-ui/core";

import "./claim.scss";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import PyramidOne from "../../assets/images/one.png";
import LightImage from "../../assets/images/light.png";


function Claim() {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });


  const claimAllowance = useSelector(state => {
    return state.account.claim && state.account.claim.claimAllowance;
  });
  const claimableAmount = useSelector(state => {
    return state.account.claim && state.account.claim.claimableAmount;
  });


  const rubyBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ruby;
  });

  const isClaimOpen = useSelector(state => {
    return state.app.isClaimOpen;
  });
  const stage = useSelector(state => {
    return state.app.stage;
  });
  const stage1ClaimableBalance = useSelector(state => {
    return state.account.claim && state.account.claim.stage1ClaimableBalance;
  });
  const stage2ClaimableBalance = useSelector(state => {
    return state.account.claim && state.account.claim.stage2ClaimableBalance;
  });
  const stage3ClaimableBalance = useSelector(state => {
    return state.account.claim && state.account.claim.stage3ClaimableBalance;
  });

  const onChangeClaim = async action => {
    if ((Number(stage) == 1 && Number(stage1ClaimableBalance) > 0) || (Number(stage) == 2 && Number(stage2ClaimableBalance) > 0) || (Number(claimableAmount) == 0)) {
      return dispatch(error("The claimable amount is 0"));
    }
    await dispatch(changeClaim({ address, action, value: "", provider, networkID: chainID }));
  };


  const isAllowanceDataLoading = claimAllowance == null;
  return (
    <div id="dashboard-view" class="claim-bonus">
      
      <div style={{ marginBottom: "16px" }} />
      <Paper className={`ohm-card`}>
        <Grid item>
        <img className="highlight-right wow animated" src={LightImage}   style={{visibility: "visible"}} />
        <img className="highlight-left wow animated" src={LightImage}   style={{visibility: "visible"}} />
        <div className="presale-header claim-center">
        <h1>Claim</h1>
        <p> Claim is {isClaimOpen ? 'active' : 'waiting'} </p>
        </div>
          <div className="stake-top-metrics data-row-centered" style={{ marginBottom: "18px" }}>
            <Typography className="presale-items">Your RUBY Balance:</Typography>
            <Typography className="presale-items" style={{ marginLeft: "16px" }}><span style={{ color: "#11d59e" }}>{rubyBalance ? Number.parseFloat(rubyBalance) : 0} RUBY</span></Typography>
          </div>
        </Grid>

        {claimableAmount &&
          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{ marginBottom: "18px" }}>
              <Typography className="presale-items">Total Claimable Amount:</Typography>
              <Typography className="presale-items" style={{ marginLeft: "16px" }}><span style={{ color: "#11d59e" }}>{(claimableAmount * 1000000000).toFixed(0)} RUBY</span></Typography>
            </div>
            <div className="stake-top-metrics data-row-centered" style={{ marginBottom: "18px" }}>
              <Typography className="presale-items">Claimable Amount in Stage 1:</Typography>
              <Typography className="presale-items" style={{ marginLeft: "16px" }}><span style={{ color: "#11d59e" }}>{Number(stage1ClaimableBalance) == 0 ? (claimableAmount * 1000000000 / 5).toFixed(0) : 0} RUBY</span></Typography>
            </div>
            <div className="stake-top-metrics data-row-centered" style={{ marginBottom: "18px" }}>
              <Typography className="presale-items">Claimable Amount in Stage 2:</Typography>
              <Typography className="presale-items" style={{ marginLeft: "16px" }}><span style={{ color: "#11d59e" }}>{Number(stage2ClaimableBalance) == 0 ? (claimableAmount * 1000000000 / 5).toFixed(0) : 0} RUBY</span></Typography>
            </div>
            <div className="stake-top-metrics data-row-centered" style={{ marginBottom: "18px" }}>
              <Typography className="presale-items">Claimable Amount in Stage 3:</Typography>
              <Typography className="presale-items" style={{ marginLeft: "16px" }}><span style={{ color: "#11d59e" }}>{Number(stage3ClaimableBalance) == 0 ? (claimableAmount * 1000000000 * 3 / 5).toFixed(0) : 0} RUBY</span></Typography>
            </div>
          </Grid>
        }
        <Grid item>
          <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
            <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">

              {isAllowanceDataLoading ? (
                <Skeleton width="45%" />
              ) : (isClaimOpen ?
                <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px",  borderRadius: "30px", padding: "30px 50px", background: "#CA8E2B", color: "#fff" }}
                    disabled={false}
                    onClick={() => {
                      onChangeClaim("claim");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "claim", "Claim")}
                  </Button>
                </Box>
                :
                <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px", borderRadius: "30px", padding: "30px 50px", background: "#CA8E2B", color: "#fff"  }}
                    disabled={true}
                    onClick={() => {
                      onChangeClaim("claim");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "claim", "Claim")}
                  </Button>
                </Box>
              )}
            </Box>
          </div>
        </Grid>
      </Paper>
    </div>
  );
}

export default Claim;
