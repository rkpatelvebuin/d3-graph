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
      const nodeCopy = Object.create(d);
      nodeCopy.fx = d.x;
      nodeCopy.fy = d.y;
      nodeCopy.radius =
        d.r + 5; /* calculate or set the radius based on your data */
      return nodeCopy;
    });
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-30))
      .force(
        "link",
        d3.forceLink(links).strength(1).distance(350).iterations(5)
      )
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.radius)
      ) // Prevent overlapping
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
        const tr = d.target.r / 2; // Radius of the target node
        const dx = tx - sx;
        const dy = ty - sy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the position of the arrowhead on the target node's perimeter
        const arrowLength = tr + 5; // 5 is the distance from the node's perimeter to the arrowhead tip
        const arrowX = tx - (dx / distance) * (tr + arrowLength);
        const arrowY = ty - (dy / distance) * (tr + arrowLength);

        context.moveTo(sx, sy);
        context.lineTo(arrowX, arrowY);

        // Calculate arrowhead angle and length
        const angle = Math.atan2(ty - arrowY, tx - arrowX);

        // Draw arrowhead
        context.lineTo(
          arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        context.moveTo(arrowX, arrowY);
        context.lineTo(
          arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
        );

        // Calculate the position of the icon on the link
        const iconX = (sx + tx) / 2;
        const iconY = (sy + ty) / 2;

        const img = new Image();
        img.src = d.icon; // Replace "your_icon_url_here" with the URL of the icon image
        const iconSize = 20; // Adjust the size of the icon as needed
        context.drawImage(
          img,
          iconX - iconSize / 2,
          iconY - iconSize / 2,
          iconSize,
          iconSize
        );
      }
      context.strokeStyle = "#aaa";
      context.stroke();
      context.beginPath();
      for (const d of nodes) {
        const img = new Image();
        img.src = d.icon; // Assuming each node has an "icon" property that holds the icon image URL
        const x = d.x - d.r;
        const y = d.y - d.r;
        const size = d.r * 2;
        context.drawImage(img, x, y, size, size);

        context.moveTo(d.x + d.r, d.y);
        context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
      }
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
    }

    d3.select(canvas).call(drag);
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default ForceDirectedGraph;
