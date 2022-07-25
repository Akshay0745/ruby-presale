import React from "react";
import { Doughnut } from "react-chartjs-2";

const data = {
  labels: ["ASSET MANAGEMENT", "MARKETING ", "ADMINISTRATION", "LIQUIDITY"],
  datasets: [
    {
      data: [5, 10, 10, 75],
      backgroundColor: ["#4000df", "#bd5b34", "#768d70", "#49e424"],
      hoverBackgroundColor: ["#4000df", "#bd5b34", "#768d70", "#49e424"],
      borderWidth: 1
    }
  ]
};
export default function ChartBar() {
  const onClick = (e) => {
    console.log(e);
  };
  return <Doughnut data={data} onClick={(e) => onClick(e)} />;
}
