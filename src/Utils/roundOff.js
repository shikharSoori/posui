export const roundOff = (number, decimalPlaces = 4) => {
  let arr = number?.toString().split(".");

  let value = number;
  if (decimalPlaces === 4) {
    if (arr[1]) {
      let myString = arr[1]?.substring(0, 6);
      value = Number(`${arr[0]}.${myString}`);
    } else {
      value = number;
    }
  } else {
    if (arr[1]) {
      let myString = arr[1]?.substring(0, 4);
      value = Number(`${arr[0]}.${myString}`);
    } else {
      value = number;
    }
  }
  if (value) {
    if (decimalPlaces > 0) {
      let multiply1 = Math.pow(10, decimalPlaces + 4);
      let divide1 = Math.pow(10, decimalPlaces);

      return (Math.round(Math.round(Number(value) * multiply1) / 10000) / divide1).toFixed(decimalPlaces);
    }
    if (decimalPlaces < 0) {
      let divide2 = Math.pow(10, Math.abs(decimalPlaces));
      let multiply2 = Math.pow(10, Math.abs(decimalPlaces));

      // return (Math.round(Math.round(Number(value) * multiply1) / 10000) / divide1).toFixed(decimalPlaces   )
      return Math.round(Math.round(Number(value) / divide2) * multiply2).toFixed(decimalPlaces);
    }
  }
  return Math.round(Number(value)).toFixed(decimalPlaces);
};

export const roundToFourDecimalPlaces = (number, decimalPlaces = 4) => {
  let arr = number?.toString().split(".");

  let value = number;
  if (decimalPlaces === 4) {
    if (arr[1]) {
      let myString = arr[1]?.substring(0, 6);
      value = Number(`${arr[0]}.${myString}`);
    } else {
      value = number;
    }
  } else {
    if (arr[1]) {
      let myString = arr[1]?.substring(0, 4);
      value = Number(`${arr[0]}.${myString}`);
    } else {
      value = number;
    }
  }
  if (value) {
    if (decimalPlaces > 0) {
      let multiply1 = Math.pow(10, decimalPlaces + 4);
      let divide1 = Math.pow(10, decimalPlaces);

      return (Math.round(Math.round(Number(value) * multiply1) / 10000) / divide1).toFixed(decimalPlaces);
    }
    if (decimalPlaces < 0) {
      let divide2 = Math.pow(10, Math.abs(decimalPlaces));
      let multiply2 = Math.pow(10, Math.abs(decimalPlaces));

      return Math.round(Math.round(Number(value) / divide2) * multiply2).toFixed(decimalPlaces);
    }
  }
  return Math.round(Number(value)).toFixed(decimalPlaces);
};

export const convertToRoman = (num) => {
  const roman = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i"];
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  let result = "";

  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += roman[i];
      num -= values[i];
    }
  }

  return result;
};
