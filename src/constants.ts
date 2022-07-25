export const EPOCH_INTERVAL = 9600;
export const TOKEN_DECIMALS = 9;
// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

interface IAddresses {
  [key: number]: { [key: string]: string };
}
export const addresses: IAddresses = {
  56: {
    BUSD_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    TOKEN_ADDRESS: "0x794a69b423726d470Ac1218f7db7CC94F97b7002",
    PRESALE_ADDRESS: "0x861f97124E439fa5F755F83d5B7D84b696bD76f8",  
  },

  1: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f",
    RUBY_ADDRESS: "0x329958c6b828c32aef708264cec88d0e0d08c930",
    PRESALE_ADDRESS: "0x27Ea4713E96d4170D1ddB7ef6A44cA23dCEE3097",
  }
};
