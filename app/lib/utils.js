export const getRandomHex = (length) => {
  const letters = "0123456789ABCDEF".split("");
  let color = "#";
  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * 16);
    color += letters[random];
  }
  return color;
};

export function getContrastColor(hexcolor) {
  var r = parseInt(hexcolor.substr(1, 2), 16);
  var g = parseInt(hexcolor.substr(3, 2), 16);
  var b = parseInt(hexcolor.substr(5, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}
