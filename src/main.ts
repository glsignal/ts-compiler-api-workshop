export function hello(text?: string) {
  console.log(`Hello, ${text ?? "World!"}`);

  return 6;
}
