import React from "react";

const App = (props: any) => {
  return (
    <div>
      <h1>Container - 2</h1>
      <span>PROPS PASSED:</span>
      <span style={{backgroundColor: props.color ? props.color : "yellow"}}>{JSON.stringify(props)}</span>
    </div>
  );
};
export default App;