const add = (first: number, second: number): number => {
  return first + second;
};

export function sum(...numbers: number[]): number {
  return numbers.reduce(add, 0);
}
