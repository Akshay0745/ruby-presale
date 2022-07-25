import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as PresaleContract } from "../abi/Presale.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContract,
      provider,
    );
    const DAIContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider);
    const DAIBalance = await DAIContract.balanceOf(addresses[networkID].PRESALE_ADDRESS);
    const totalDAIAmount = ethers.utils.formatEther(DAIBalance);

  
    const isPresaleOpen = await presaleContract.saleActive();
    
    const isClaimOpen = await presaleContract.claimActive();
    const getRubyTokensLeft = await presaleContract.getRubyTokensLeft();
    const presaleStartTime =  await presaleContract.presaleStartTime();
    const stage =  await presaleContract.stage();
  
    let totalTokenSold = await presaleContract.getTotalTokensSold();
    totalTokenSold = ethers.utils.formatEther(totalTokenSold);
    
    return {
      isPresaleOpen,
      isClaimOpen,
      totalTokenSold,
      totalDAIAmount,
      getRubyTokensLeft,
      presaleStartTime,
      stage
    } as IPresaleData;
  },
);

interface IPresaleData {
  readonly isPresaleOpen: boolean;
  readonly isClaimOpen: boolean;
  readonly rate: number;
  readonly totalTokenSold: number;
  readonly totalDAIAmount: string;
  readonly getRubyTokensLeft: number;
  readonly totalDepositedBalance: string;
  readonly presaleStartTime: number;
  readonly stage: number;

}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
