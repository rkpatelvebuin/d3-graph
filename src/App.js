import React, { useEffect } from "react";
import data1 from "./d3/d3Data.json";
// import Graph from "./Graph";
// import ForceDirectedGraphNew from "./d3-new";

import "./style.css";
import ForceDirectedGraph from "./d3";
import { allData, d3Links, d3Nodes } from "./d3/d3-data";

// const styles = {
//   fontFamily: "sans-serif",
//   textAlign: "center",
//   height: "100%",
//   width: "100%",
// };

const App = () => {
  const getFormattedData = (data) => {
    let newData = { nodes: [], links: [] };
    data.d3Data.forEach((element, idx) => {
      newData.nodes.push({
        index: idx,
        icon: element.icon,
        r: element.r,
        x: element.x,
        y: element.y,
      });
      if (element.target.length) {
        element.target.forEach((link) => {
          newData.links.push({
            source: idx,
            target: link.id,
            icon: link.icon,
          });
        });
      }
    });
    return newData;
  };
  const data = () => {
    return getFormattedData(allData);
    // console.log(dddd, "dddd");
    // const nodes = d3Nodes;
    // const links = d3Links;
    // return { nodes, links };
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
