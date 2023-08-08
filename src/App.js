import React, { useEffect, useState } from "react";
import "./style.css";
import ForceDirectedGraph from "./d3";
import { allData } from "./d3/d3-data";

const App = () => {
  const [links, setLinks] = useState([]);
  const [nodes, setNodes] = useState([]);

  const getFormattedData = ({ allData, isReSet = false }) => {
    let nodes = [];
    let links = [];
    allData.d3Data.forEach((element, idx) => {
      nodes.push({
        index: idx,
        icon: element.icon,
        r: element.r,
        x: isReSet ? undefined : element.x,
        y: isReSet ? undefined : element.y,
      });
      if (element.target.length) {
        element.target.forEach((link) => {
          links.push({
            source: idx,
            target: link.id,
            icon: link.icon,
          });
        });
      }
    });
    setLinks(links);
    setNodes(nodes);
  };

  useEffect(() => {
    getFormattedData({ allData });
  }, []);

  const reSet = () => {
    getFormattedData({ allData, isReSet: true });
  };

  return (
    <div>
      <button onClick={reSet}>Reset</button>
      <div>
        <ForceDirectedGraph
          data={{ nodes: nodes, links: links }}
          width={1000}
          height={800}
        />
      </div>
    </div>
  );
};

export default App;
