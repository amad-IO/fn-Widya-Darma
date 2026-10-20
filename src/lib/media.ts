export const imageAsset = (number: number) =>
  `/images/${String(number).padStart(2, "0")}.webp`;
