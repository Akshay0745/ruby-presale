import React from 'react'
import CoinImage from "../../assets/images/coin-image.png";
import "./coin.scss";

export const CoinMoving = () => {
  return (
    <div className="coin-moving">
        <img src={CoinImage}  className='falling-coin top-coin'/> 
        <img src={CoinImage}  className='falling-coin center-coin'/> 
        <img src={CoinImage}  className='falling-coin left-coin'/> 
        <img src={CoinImage}  className='falling-coin bottom-coin'/> 
        <img src={CoinImage}  className='falling-coin bottom-center-coin'/> 
        <img src={CoinImage}  className='falling-coin bottom-right-coin'/> 
        <img src={CoinImage}  className='falling-coin center-top-coin'/> 
        <img src={CoinImage}  className='falling-coin center-bottom-coin'/> 
        <img src={CoinImage}  className='falling-coin bottom-coin'/> 
    </div>
  )
}
