import React, { PropsWithChildren, useEffect, useState } from 'react';

interface FooProps extends PropsWithChildren {
  foo: string;
}

const TestA = () => <>TestA</>;
const TestB = () => <p>TestB</p>;

function Counter(props: FooProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{` ${props.foo} counter: ${seconds}`}</>;
}

export const Test: React.FC<FooProps> = ({ foo, children }) => (
  <div
    style={{
      padding: 10,
      color: 'black',
      borderColor: 'green',
      borderWidth: 10,
      borderStyle: 'solid',
    }}
  >
    Hello world from react. Foo: {foo}
    <br />
    <TestA />
    <TestB />
    <br />
    <Counter foo={foo} />
    {children}
  </div>
);
