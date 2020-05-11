import React, { useRef, useEffect } from "react";
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import useResizeObserver from "./useResizeObserver";

function MarketValue({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    if (!dimensions) return;

    // scales
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width])
      .padding(0.5);

    // domain 0 will be mapped to 150, while domain 150 will be mapped to 0
    const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);

    const colorScale = scaleLinear()
      .domain([50, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    // axis
    const xAxis = axisBottom(xScale).ticks(data.length);

    const yAxis = axisRight(yScale);

    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);

    // draw the bars
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -dimensions.height)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (value, index) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => dimensions.height - yScale(value));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginTop: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default MarketValue;
