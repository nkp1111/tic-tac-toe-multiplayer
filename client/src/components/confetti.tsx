import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const winningColors = [
  "#FFD700", // Gold
  "#FFC000", // Orange
  "#FF5733", // Coral
  "#FF33CC", // Hot Pink
  "#33CC33", // Lime Green
  "#00CCFF", // Sky Blue
];
const losingColors = [
  "#CCCCCC", // Light Gray
  "#EAEAEA", // Light Silver
  "#F0F0F0", // Light Gray
  "#F5F5F5", // Light Silver
  "#F8F8F8", // Light Gray
  "#FAFAFA", // Light Silver
];


export default function ConfettiCel(
  { won }
) {
  const { width, height } = useWindowSize();
  let colors = won ? winningColors : losingColors;
  return (
    <Confetti
      width={width}
      height={height}
      colors={colors}
    />
  )
}