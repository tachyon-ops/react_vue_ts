const Greeter = (str: string) => `Hello ${str}`;

test("My Greeter", () => {
  expect(Greeter("Carl")).toBe("Hello Carl");
});
