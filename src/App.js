import React from "react";
import Graph from "./Graph";
import "./style.css";
import ForceDirectedGraph from "./d3";
import ForceDirectedGraphNew from "./d3-new";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  height: "100%",
  width: "100%"
};

const App = () => {
  return (
      // <Graph id="graph" config={config} data={data} />
    <div style={styles}>
      <Graph
        width="100%"
        nodes={[
          { id: 1, name: "node 1", dependsOn: [2], type:["cc"], twoSide:[2] },
          // { id: 7, name: "node 7", dependsOn: [], type:[] },
          { id: 2, name: "node 2", dependsOn: [1], type:["aa"], twoSide:[1] },
          // { id: 3, name: "node 3", dependsOn: [2], type:["aa"] },
          // { id: 4, name: "node 4", dependsOn: [2], type:["bb"] },
          // { id: 5, name: "node 5", dependsOn: [4, 7], type:["aa","bb"] },
          // { id: 6, name: "node 6", dependsOn: [5], type:["cc"] } 
        ]}
      />
      {/* <ForceDirectedGraph/> */}
      {/* <ForceDirectedGraphNew/> */}
    </div>
  );
};

export default App
