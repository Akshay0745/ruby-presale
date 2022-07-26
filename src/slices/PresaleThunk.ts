import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as Presale } from "../abi/Presale.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, presaleAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "DAI") {
    applicableAllowance = presaleAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "presale/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, signer);
    let approveTx;
    let presaleAllowance = await daiContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);

    // return early if approval has already happened
    if (alreadyApprovedToken(token, presaleAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          presale: {
            presaleAllowance: +presaleAllowance,
          },
        }),
      );
    }

    try {
      if (token === "DAI") {
        // won't run if stakeAllowance > 0
        approveTx = await daiContract.approve(
          addresses[networkID].PRESALE_ADDRESS,
          ethers.utils.parseUnits("1000000000000000000", "gwei").toString(),
        );
      }

      const text = "Approve dai";
      const pendingTxnType = "approve_deposit";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    presaleAllowance = await daiContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        presale: {
          presaleAllowance: +presaleAllowance,
        },
      }),
    );
  },
);

export const changeDeposit = createAsyncThunk(
  "presale/changeDeposit",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const presale = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, Presale, signer);

    let depositTx;
    console.log('123', ethers.utils.parseUnits(value, "ether"));
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      uaData.type = "presale";
      depositTx = await presale.buy(ethers.utils.parseUnits(value, "ether"));
      const pendingTxnType = "depositing";
      uaData.txHash = depositTx.hash;
      dispatch(fetchPendingTxns({ txnHash: depositTx.hash, text: "Depositing...", type: pendingTxnType }));
      await depositTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error(
            "You may be trying to deposit more than your balance! Error code: 32603. Message: ds-math-sub-underflow",
          ),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (depositTx) {
        // segmentUA(uaData);

        dispatch(clearPendingTxn(depositTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
