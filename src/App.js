import React, { useState } from "react";
import { Container } from "@material-ui/core";
import MarketValue from "./components/MarketValue";
import "./App.css";

function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 60, 75]);

  return (
    <div className="App">
      <Container fixed>
        <MarketValue data={data} />
      </Container>
    </div>
  );
}

export default App;
