export class Math {
  add(first: number, second: number): number {
    if (first === NaN || second === NaN) {
      return NaN;
    }

    return first + second;
  }
}

const myNumber = 8;

const isMyNumberNaN = myNumber == NaN;

const arrowIsNaN = () => myNumber === NaN;

function FnIsNaN() {
  function InnerNaN() {
    return myNumber == NaN;
  }
  return InnerNaN();
}
