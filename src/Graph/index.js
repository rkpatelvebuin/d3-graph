import React from "react";
import PropTypes from "prop-types";
import {
  forceSimulation,
  forceLink,
  forceCollide,
  forceX,
  forceY,
  forceManyBody
} from "d3-force";
import LOGO from "../logo.svg"
import { data } from "./test";

class Graph extends React.Component {
  constructor(props) {
    super(props);

    // calculate links
    const links = [];
    props.nodes.forEach(n => {
      if (!n.dependsOn) {
        return;
      }

      n.dependsOn.forEach((index, idx) => {
        links.push({ source: index, target: n.id, type: n.type[idx] });
        if(n.dependsOn.length === idx + 1){
          n.twoSide.forEach((index, idx)=>{
            links.push({source: n.id, target: n.twoSide[idx], twoSide: true})
          })
        }
      });
    });

    this.state = {
      nodes: props.nodes,
      links: links
    };

    this.state.height = this.getMaxPath() * 150 + 100;
  }

  componentDidMount() {
    const { nodes, links } = this.state;
    this.simulation = forceSimulation(nodes)
    .force(
      "link",
      forceLink()
      .id(d => d.id)
      .links(links)
      .distance(100)
      .strength(0.9)
      )
      .force("x", forceX(200).strength(0.1))
      .force("charge", forceManyBody().strength(-1500))
      .force(
        "y",
        forceY()
          .y(node => {
            return this.calcPath(node) * 150 - 75;
          })
          .strength(node => {
            
            return 3;
          })
          )
          .force("collide", forceCollide(this.props.radius));
          
          this.simulation.on("tick", () =>{
            return(
              this.setState({
                links: this.state.links,
                nodes: this.state.nodes
              })
              )
            });
    this.simulation.on("end", () => console.log("simulation end"));
  }

  componentWillUnmount() {
    this.simulation.stop();
  }

  nodeDependedOn(node) {
    const { nodes } = this.state;
    let dependedOn = false;

    nodes.forEach(n => {
      dependedOn = dependedOn || n.dependsOn.includes(node.id);
    });

    return dependedOn;
  }

  getMaxPath() {
    const { nodes } = this.state;

    const terminations = [];
    nodes.forEach(node => {
      if (!this.nodeDependedOn(node)) {
        terminations.push(node);
      }
    });
    return Math.max(...terminations.map(node => this.calcPath(node)));
  }

  calcPath(node, length = 1) {
    const { nodes } = this.state;

    // end case
    if (!node.dependsOn) {
      return length;
    }
return node.id;
    // return Math.max(
    //   ...node.dependsOn.map(id =>
    //     this.calcPath(nodes.find(n => n.id === id), length + 1)
    //   )
    // );
  }

  render() {
    const { width, radius } = this.props;
    const { nodes, links, height } = this.state;
console.log(links,'links');
    return (
      <svg className="container" height={height} width={width}>
        <defs>
          <marker
            id="suit"
            viewBox="0 -5 10 10"
            refX={12}
            refY={0}
            markerWidth={12}
            markerHeight={12}
            orient="auto"
          >
            <path
              d="M0,-5L10,0L0,5 L10,0 L0, -5"
              stroke="#4679BD"
              opacity={0.6}
            />
          </marker>
        </defs>
        <g>
          {nodes.map(n => (
            <g>
              <circle cx={n.x} cy={n.y} r={radius} fill="#FFF" stroke="#000" />
              <text textAnchor="middle" x={n.x} y={n.y}>
                {n.name}
              </text>
            </g>
          ))}
          {data.map((link, index) => (
            <line
              x1={link.source.x}
              y1={link.source.y + radius}
              x2={link.target.x}
              y2={link.target.y - radius}
              key={`line-${index}`}
              stroke="#4679BD"
              markerEnd="url(#suit)"
              markerStart={link.twoSide ? "url(#suit)" : ""}
            />
          ))}
        </g>
      </svg>
    );
  }
}

Graph.propTypes = {
  radius: PropTypes.number
};

Graph.defaultProps = {
  radius: 50
};

export default Graph;
