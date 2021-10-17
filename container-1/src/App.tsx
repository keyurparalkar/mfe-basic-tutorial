import React from "react";

//@ts-ignore
const App2 = React.lazy(() => import("container2/App"));

const App = () => {
  return (
    <div>
      <h1>Container - 1</h1>
      <h2>Create React App from Scratch Using Typescript..!!</h2>
      <React.Suspense fallback="Loading Button">
      <App2 color="orange"/>
    </React.Suspense>
    </div>
  );
};
export default App;
