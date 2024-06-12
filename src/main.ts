export const hello = (text?: string) => {
  console.log(`Hello, ${text ?? "World!"}`);
};

let world = <T>(t: T): T => {
    return t;
  },
  another = () => {
    console.log("another");
  },
  aThird = () => "test",
  a = 5,
  b = "string",
  c = true;
