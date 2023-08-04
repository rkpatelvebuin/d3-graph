import React from "react";
import Graph from "./Graph";
import "./style.css";
import app from "../src/app-logo.jpg";
import javaScript from "../src/js-logo.png";
import angular from "../src/angular-logo.png";
import react from "../src/react-logo.png";
import next from "../src/next-logo.png";
import phone from "../src/phone-solid.svg";
import radio from "../src/radio-solid.svg";
import ForceDirectedGraph from "./d3";
import ForceDirectedGraphNew from "./d3-new";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  height: "100%",
  width: "100%",
};

const App = () => {
  const data = () => {
    const n = 2;
    // const nodes = Array.from({length: n * n}, (_, i) => ({index: i}));
    const nodes = [
      {
        index: 0,
        r: 35,
        icon: app,
      },
      {
        index: 1,
        r: 35,
        icon: javaScript,
      },
      {
        index: 2,
        r: 35,
        icon: angular,
      },
      {
        index: 3,
        r: 35,
        icon: react,
      },
      {
        index: 4,
        r: 35,
        icon: next,
      },
    ];
    const links = [
      {
        source: 0,
        target: 1,
        icon: phone,
      },
      {
        source: 1,
        target: 0,
      },
      {
        source: 1,
        target: 2,
        icon: radio,
      },
      {
        source: 1,
        target: 3,
        icon: radio,
      },
      {
        source: 3,
        target: 4,
        icon: radio,
      },
    ];
    // for (let y = 0; y < n; ++y) {
    //   for (let x = 0; x < n; ++x) {
    //     if (y > 0) links.push({ source: (y - 1) * n + x, target: y * n + x });
    //     if (x > 0) links.push({ source: y * n + (x - 1), target: y * n + x });
    //   }
    // }
    return { nodes, links };
  };

  return (
    // <Graph id="graph" config={config} data={data} />
    // <div style={styles}>
    // <Graph
    //   width="100%"
    //   nodes={[
    //     { id: 1, name: "node 1", dependsOn: [2], type:["cc"], twoSide:[2] },
    //     // { id: 7, name: "node 7", dependsOn: [], type:[] },
    //     { id: 2, name: "node 2", dependsOn: [1], type:["aa"], twoSide:[1] },
    //     // { id: 3, name: "node 3", dependsOn: [2], type:["aa"] },
    //     // { id: 4, name: "node 4", dependsOn: [2], type:["bb"] },
    //     // { id: 5, name: "node 5", dependsOn: [4, 7], type:["aa","bb"] },
    //     // { id: 6, name: "node 6", dependsOn: [5], type:["cc"] }
    //   ]}
    // />
    <ForceDirectedGraph data={data()} width={1000} height={800} />
    // {/* <ForceDirectedGraphNew/> */}
    // </div>
  );
};

export default App;
