import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const data = {
    links: [
      { source: 'Microsoft', target: 'Amazon', type: 'licensing' },
      { source: 'Microsoft', target: 'Amazon', type: 'suit' },
      { source: 'Samsung', target: 'Apple', type: 'suit' },
      { source: 'Microsoft', target: 'Amazon', type: 'resolved' },
    ],
  };

const ForceDirectedGraphNew = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const links = data.links;
    const nodes = {};

    links.forEach((link) => {
      link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
      link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
    });

    const w = 600;
    const h = 600;

    const force = d3
      .forceSimulation()
      .nodes(Object.values(nodes))
      .force('link', d3.forceLink(links).id((d) => d.name).distance(60))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .on('tick', tick);

    const svg = d3.select(svgRef.current).attr('width', w).attr('height', h);

    svg.append('defs').selectAll('marker')
      .data(['suit', 'licensing', 'resolved'])
      .enter().append('marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', -1.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

    const path = svg.append('g').selectAll('path')
      .data(force.links())
      .enter().append('path')
      .attr('class', (d) => 'link ' + d.type)
      .attr('marker-end', (d) => 'url(#' + d.type + ')');

    const circle = svg.append('g').selectAll('circle')
      .data(force.nodes())
      .enter().append('circle')
      .attr('r', 6)
      .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

    const text = svg.append('g').selectAll('g')
      .data(force.nodes())
      .enter().append('g');

    text.append('text')
      .attr('x', 8)
      .attr('y', '.31em')
      .attr('class', 'shadow')
      .text((d) => d.name);

    text.append('text')
      .attr('x', 8)
      .attr('y', '.31em')
      .text((d) => d.name);

    function tick() {
      path.attr('d', (d) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = 75 / d.linknum;
        return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
      });

      circle.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

      text.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');
    }

    function dragstarted(event, d) {
      if (!event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) force.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      // Clean up any D3-related resources here
      force.stop();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraphNew;
