import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ForceDirectedGraph = ({ data, width, height }) => {
  const canvasRef = useRef();
  const [newLink, setNewLink] = useState({});
  const [linkStart, setLinkStart] = useState({});
  const [linkEnd, setLinkEnd] = useState({});
  const [pointers, setPointers] = useState([]);
  const [nodeIndex, setNodeIndex] = useState("");
  console.log(newLink, "newLink123");

  // const getNewLinkXY = ({ linkStart, linkEnd }) => {};

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let linksData = data.links;
    if (Object.keys(newLink).length === 2) {
      // const XY = getNewLinkXY({ linkStart, linkEnd });
      linksData = [...linksData, newLink];
    }
    const links = linksData.map((d) => {
      const linksCopy = Object.create(d);
      return linksCopy;
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
        // console.log(data.links, "ddd");
        // const tr = d.target.r / 3; // Radius of the target node
        // const sr = d.source.r; // Radius of the target node
        // const sx =
        //   // data.links[d.source.index].x +
        //   data.links[d.index]?.sourceAxis.x +
        //   sr *
        //     Math.cos(
        //       Math.atan2(
        //         data.links[d.index]?.targetAxis.y -
        //           data.links[d.index]?.sourceAxis.y,
        //         data.links[d.index]?.targetAxis.x -
        //           data.links[d.index]?.sourceAxis.x
        //       )
        //     );
        // const sy =
        //   data.links[d.index]?.sourceAxis.y +
        //   sr *
        //     Math.sin(
        //       Math.atan2(
        //         data.links[d.index]?.targetAxis.y -
        //           data.links[d.index]?.sourceAxis.y,
        //         data.links[d.index]?.targetAxis.x -
        //           data.links[d.index]?.sourceAxis.x
        //       )
        //     );
        // const tx =
        //   data.links[d.index]?.targetAxis.x -
        //   tr *
        //     Math.cos(
        //       Math.atan2(
        //         data.links[d.index]?.targetAxis.y -
        //           data.links[d.index]?.sourceAxis.y,
        //         data.links[d.index]?.targetAxis.x -
        //           data.links[d.index]?.sourceAxis.x
        //       )
        //     );
        // const ty =
        //   data.links[d.index]?.targetAxis.y -
        //   tr *
        //     Math.sin(
        //       Math.atan2(
        //         data.links[d.index]?.targetAxis.y -
        //           data.links[d.index]?.sourceAxis.y,
        //         data.links[d.index]?.targetAxis.x -
        //           data.links[d.index]?.sourceAxis.x
        //       )
        //     );
        // console.log(sx, sy, tx, ty, "poiuoupou");
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
      // Update link positions based on dragged node
      for (const link of linksData) {
        console.log(link, "777777");
        if (link.source === event.subject.index) {
          link.sourceAxis.x = event.x;
          link.sourceAxis.y = event.y;
        } else if (link.target === event.subject.index) {
          link.targetAxis.x = event.x;
          link.targetAxis.y = event.y;
        }
      }
    }

    function dragEnded(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    canvas.addEventListener("mousemove", (event) => {
      context.clearRect(0, 0, width, height);
      ticked(); // Redraw the graph
      const mouse = d3.pointer(event);
      const hoveredNode = simulation.find(
        mouse[0] - width / 2,
        mouse[1] - height / 2,
        40
      );
      if (hoveredNode) {
        const angleStep = (2 * Math.PI) / 18;
        let pointers = [];
        for (let i = 0; i < 18; i++) {
          const angle = i * angleStep;
          const x =
            hoveredNode.x + hoveredNode.radius * Math.cos(angle) + width / 2;
          const y =
            hoveredNode.y + hoveredNode.radius * Math.sin(angle) + height / 2;
          pointers = [...pointers, { x: x, y: y }];
          context.beginPath();
          context.arc(x, y, 2, 0, 2 * Math.PI);
          context.fillStyle = "rgba(255, 0, 0, 0.5)";
          context.fill();
        }
        pointers.length && setPointers(pointers);
        setNodeIndex(hoveredNode.index);
      }
    });

    function canvasClicked(event) {
      const mouse = d3.pointer(event);
      let closestX = pointers[0].x;
      let closestY = pointers[0].y;
      let closestDiffX = Math.abs(mouse[0] - closestX);
      let closestDiffY = Math.abs(mouse[1] - closestY);

      pointers.forEach((i) => {
        let currentX = i.x;
        let currentY = i.y;
        let currentDiffX = Math.abs(mouse[0] - currentX);
        let currentDiffY = Math.abs(mouse[1] - currentY);
        if (currentDiffX < closestDiffX) {
          closestX = currentX;
          // Update the closest number
          closestDiffX = currentDiffX;
          // Update the closest difference
        }
        if (currentDiffY < closestDiffY) {
          closestY = currentY;
          // Update the closest number
          closestDiffY = currentDiffY;
          // Update the closest difference
        }
      });
      if (!Object.keys(linkStart).length) {
        setLinkStart({ x: mouse[0], y: mouse[1] });
        setNewLink({ source: nodeIndex });
      } else {
        setLinkEnd({ x: mouse[0], y: mouse[1] });
        setNewLink({ ...newLink, target: nodeIndex });
      }
    }
    canvas.addEventListener("click", canvasClicked);
    canvas.addEventListener("mousedown", (event) => {
      const mouse = d3.pointer(event);
      // let closestX = pointers[0].x;
      // let closestY = pointers[0].y;
      // let closestDiffX = Math.abs(mouse[0] - closestX);
      // let closestDiffY = Math.abs(mouse[1] - closestY);

      // pointers.forEach((i) => {
      //   let currentX = i.x;
      //   let currentY = i.y;
      //   let currentDiffX = Math.abs(mouse[0] - currentX);
      //   let currentDiffY = Math.abs(mouse[1] - currentY);
      //   if (currentDiffX < closestDiffX) {
      //     closestX = currentX;

      //     // Update the closest number
      //     closestDiffX = currentDiffX;

      //     // Update the closest difference
      //   }
      //   if (currentDiffY < closestDiffY) {
      //     closestY = currentY;

      //     // Update the closest number
      //     closestDiffY = currentDiffY;

      //     // Update the closest difference
      //   }
      // });
      // if (!Object.keys(linkStart).length) {
      //   setLinkStart({ x: mouse[0], y: mouse[1] });
      //   setNewLink({ source: nodeIndex });
      // } else {
      //   setLinkEnd({ x: mouse[0], y: mouse[1] });
      //   setNewLink({ ...newLink, target: nodeIndex });
      // }
    });
    d3.select(canvas).call(drag);

    return () => {
      simulation.stop();
      canvas.removeEventListener("mousemove", null);
      canvas.removeEventListener("click", canvasClicked);
    };
  }, [data, width, height, linkStart, pointers, newLink]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default ForceDirectedGraph;
