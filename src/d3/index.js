import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ForceDirectedGraph = ({ data, width, height }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const links = data.links.map((d) => {
      return Object.create(d);
    });
    const nodes = data.nodes.map((d) => {
      return Object.create(d);
    });
    console.log(data.links, "datalink");
    console.log(data.nodes, "datanodes");
    console.log(links, "links");
    console.log(nodes, "nodes");
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-30))
      .force(
        "link",
        d3.forceLink(links).strength(1).distance(20).iterations(10)
      )
      .on("tick", ticked);

    function ticked() {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);
      context.beginPath();
      for (const d of links) {
        const sx = d.source.x;
        const sy = d.source.y;
        const tx = d.target.x;
        const ty = d.target.y;

        context.moveTo(sx, sy);
        context.lineTo(tx, ty);

        // Calculate arrowhead angle and length
        console.log(ty, sy, tx, sx);
        const angle = Math.atan2(ty - sy, tx - sx);
        const arrowLength = 50;

        // Draw arrowhead
        context.lineTo(
          tx - arrowLength * Math.cos(angle - Math.PI / 6),
          ty - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        context.moveTo(tx, ty);
        context.lineTo(
          tx - arrowLength * Math.cos(angle + Math.PI / 6),
          ty - arrowLength * Math.sin(angle + Math.PI / 6)
        );
      }
      context.strokeStyle = "#aaa";
      context.stroke();
      context.beginPath();
      for (const d of nodes) {
        context.moveTo(d.x + d.r, d.y);
        context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
      }
      context.fillStyle = "white";
      context.fill();
      context.strokeStyle = "#000000";
      context.stroke();
      context.restore();
    }

    const drag = d3
      .drag()
      .subject(({ x, y }) => simulation.find(x - width / 2, y - height / 2, 40))
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);

    function dragStarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = event.x;
      event.subject.fy = event.y;
      console.log(links, "linkschng");
    }

    d3.select(canvas).call(drag);
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default ForceDirectedGraph;
