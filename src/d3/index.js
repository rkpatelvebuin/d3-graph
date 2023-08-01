import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'underscore';

const ForceDirectedGraph = () => {
  const svgRef = useRef(null);

  // DATA
  const nodes = [{}, {}, {}, {}];

  const links = [
    // one link
    {
      source: 0,
      target: 1,
    },
    // two links
    {
      source: 1,
      target: 2,
    },
    {
      source: 1,
      target: 2,
    },
    // three links
    {
      source: 2,
      target: 3,
    },
    {
      source: 2,
      target: 3,
    },
    {
      source: 2,
      target: 3,
    },
  ];

  // DATA FORMATTING
  _.each(links, function (link) {
    // find other links with same target+source or source+target
    const same = _.where(links, {
      source: link.source,
      target: link.target,
    });
    const sameAlt = _.where(links, {
      source: link.target,
      target: link.source,
    });
    const sameAll = same.concat(sameAlt);

    _.each(sameAll, function (s, i) {
      s.sameIndex = i + 1;
      s.sameTotal = sameAll.length;
      s.sameTotalHalf = s.sameTotal / 2;
      s.sameUneven = s.sameTotal % 2 !== 0;
      s.sameMiddleLink = s.sameUneven === true && Math.ceil(s.sameTotalHalf) === s.sameIndex;
      s.sameLowerHalf = s.sameIndex <= s.sameTotalHalf;
      s.sameArcDirection = s.sameLowerHalf ? 0 : 1;
      s.sameIndexCorrected = s.sameLowerHalf ? s.sameIndex : s.sameIndex - Math.ceil(s.sameTotalHalf);
    });
  });

  const maxSame = _.chain(links)
    .sortBy(function (x) {
      return x.sameTotal;
    })
    .last()
    .value().sameTotal;

  _.each(links, function (link) {
    link.maxSameHalf = Math.floor(maxSame / 3);
  });

  // EFFECT HOOK
  useEffect(() => {
    const width = 400;
    const height = 400;

    const force = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', tick);

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    // RENDER LINKS
    const path = svg
      .append('g')
      .selectAll('path')
      .data()
      .enter()
      .append('path')
      .style('stroke', function (d) {
        return d3.scaleOrdinal().range()[d.sameIndex - 1];
      });

    // RENDER NODES
    const circle = svg
      .append('g')
      .selectAll('circle')
      .data(force.nodes())
      .enter()
      .append('circle')
      .attr('r', 8)
      .call(d3.drag().on('start', dragstart).on('drag', dragged));

    // TICK FUNCTION
    function tick() {
      circle.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
      path.attr('d', linkArc);
    }

    // DRAG FUNCTIONS
    function dragstart(event, d) {
      if (!event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    // ARC CALCULATION
    function linkArc(d) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      const unevenCorrection = d.sameUneven ? 0 : 0.5;
      const arc = (dr * d.maxSameHalf) / (d.sameIndexCorrected - unevenCorrection);

      if (d.sameMiddleLink) {
        arc = 0;
      }

      return 'M' + d.source.x + ',' + d.source.y + 'A' + arc + ',' + arc + ' 0 0,' + d.sameArcDirection + ' ' + d.target.x + ',' + d.target.y;
    }

    // CLEANUP
    return () => {
      force.stop();
    };
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;
