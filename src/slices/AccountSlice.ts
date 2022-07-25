import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PresaleContractAbi } from "../abi/Presale.json";
import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";


export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {

    let rubyBalance = 0;
    let daiBalance = 0;
    let presaleAllowance = 0;
    let claimAllowance = 0;
    let claimableAmount = 0;
    let totalclaimAmount = 0;
    let isAddedWhitelist = false;
    let stage1ClaimableBalance = 0;
    let stage2ClaimableBalance = 0;
    let stage3ClaimableBalance = 0;
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider);
    daiBalance = await daiContract.balanceOf(address);
    const rubyContract = new ethers.Contract(addresses[networkID].RUBY_ADDRESS as string, ierc20Abi, provider);
    rubyBalance = await rubyContract.balanceOf(address);
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContractAbi,
      provider,
    );

    if (addresses[networkID].DAI_ADDRESS) {
      presaleAllowance = await daiContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

    if (addresses[networkID].RUBY_ADDRESS) {
      claimAllowance = await rubyContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }
    isAddedWhitelist = await presaleContract.whiteListed(address);

    claimableAmount = await presaleContract.tokensUnclaimed(address);

    totalclaimAmount = await presaleContract.tokensOwned(address);
    stage1ClaimableBalance = await presaleContract.stage1claimableToken(address);
    stage2ClaimableBalance = await presaleContract.stage2claimableToken(address);
    stage3ClaimableBalance = await presaleContract.stage3claimableToken(address);
    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ruby: ethers.utils.formatUnits(rubyBalance, "gwei"),
      },
      presale: {
        presaleAllowance: +presaleAllowance,
        isWhiteList: isAddedWhitelist,
      },
      claim: {
        claimAllowance: +claimAllowance,
        claimableAmount: ethers.utils.formatEther(claimableAmount),
        totalclaimAmount: ethers.utils.formatEther(totalclaimAmount),
        stage1ClaimableBalance: +stage1ClaimableBalance,
        stage2ClaimableBalance: +stage2ClaimableBalance,
        stage3ClaimableBalance: +stage3ClaimableBalance
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let rubyBalance = 0;
    let daiBalance = 0;
    let presaleAllowance = 0;
    let claimAllowance = 0;
    let claimableAmount = 0;
    let totalclaimAmount = 0;
    let isAddedWhitelist = false;
    let stage1ClaimableBalance = 0;
    let stage2ClaimableBalance = 0;
    let stage3ClaimableBalance = 0;
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider);
    daiBalance = await daiContract.balanceOf(address);
    const rubyContract = new ethers.Contract(addresses[networkID].RUBY_ADDRESS as string, ierc20Abi, provider);
    rubyBalance = await rubyContract.balanceOf(address);
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContractAbi,
      provider,
    );

    if (addresses[networkID].DAI_ADDRESS) {
      presaleAllowance = await daiContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

    if (addresses[networkID].RUBY_ADDRESS) {
      claimAllowance = await rubyContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }
    isAddedWhitelist = await presaleContract.whiteListed(address);

    claimableAmount = await presaleContract.tokensUnclaimed(address);

    totalclaimAmount = await presaleContract.tokensOwned(address);
    stage1ClaimableBalance = await presaleContract.stage1claimableToken(address);
    stage2ClaimableBalance = await presaleContract.stage2claimableToken(address);
    stage3ClaimableBalance = await presaleContract.stage3claimableToken(address);
    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ruby: ethers.utils.formatUnits(rubyBalance, "gwei"),
      },
      presale: {
        presaleAllowance: +presaleAllowance,
        isWhiteList: isAddedWhitelist,
      },
      claim: {
        claimAllowance: +claimAllowance,
        claimableAmount: ethers.utils.formatEther(claimableAmount),
        totalclaimAmount: ethers.utils.formatEther(totalclaimAmount),
        stage1ClaimableBalance: +stage1ClaimableBalance,
        stage2ClaimableBalance: +stage2ClaimableBalance,
        stage3ClaimableBalance: +stage3ClaimableBalance
      },
    };
  },
);


interface IAccountSlice {
  balances: {
    ruby: string;
    dai: string;

  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  balances: { ruby: "", dai: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
