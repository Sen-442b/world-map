import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Map from "./components/Maps/Map";
import Header from "./components/Header/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Header />
      <Map />
    </div>
  );
}

export default App;
