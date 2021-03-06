import { select } from 'd3-selection'
import { extent, max } from 'd3-array'
import { scaleLinear, scaleSqrt, scalePow, scaleOrdinal } from 'd3-scale'
import { axisLeft } from 'd3-axis'
import { interpolateHcl } from 'd3-interpolate'
import { rgb } from 'd3-color'
import { line } from 'd3-shape'
import { default as tip } from 'd3-tip'

export default function foodwebstatic() {

	//----------------------------
	// Default parameters
	//----------------------------
	
	var paddingLeft = 50,
		paddingRight = 10, 
		paddingTop = 10, 
		paddingBottom = 10,
		tllim = [NaN, NaN],
		rlim = [1, 50],
		blim = [NaN, NaN],
		totwidth = 960,
		totheight = 600,
		colfun = NaN,
		lwmax = 100,
		wmax = NaN,
		pedge = 1/3;

	//----------------------------
	// Main plotting routine
	//----------------------------
		
	function chart(selection) {
		selection.each(function(data, i) {
			
			// Add SVG canvas

			var svg = select(this).append("svg")
							.attr("width", totwidth)
							.attr("height", totheight);

			// Draw rectangle in axis plotting area, for reference

			svg.append("rect")
				.attr("class", "fwaxis")
				.attr("x", paddingLeft)
				.attr("y", paddingTop)
				.attr("width", totwidth - paddingLeft - paddingRight)
				.attr("height", totheight - paddingTop - paddingBottom)
				.attr("fill", "none");

			// Extract data

			var nodedata = data.nodes[0]
			var flxdata = data.links1[0]
			var grpdata = data.links2[0]

			// Scales

			var tllimdefault = extent(nodedata, function(d) {return d.TL});

			if (isNaN(tllim[0])) {
				tllim[0] = tllimdefault[0]
			}
			if (isNaN(tllim[1])) {
				tllim[1] = tllimdefault[1]
			}

			var blimdefault = extent(nodedata, function(d) {return d.B});
			if (isNaN(blim[0])) {
				blim[0] = blimdefault[0]
			}
			if (isNaN(blim[1])) {
				blim[1] = blimdefault[1]
			}

			var tl2y = scaleLinear()
				.domain([tllim[0], tllim[1]])
				.range([totheight-paddingBottom, paddingTop]);

			var yAxis = axisLeft(tl2y);

			var b2r = scaleSqrt()
				.domain(blim)
				.range(rlim)
				.clamp(true);
			
			if (isNaN(wmax)) {	
				wmax = max(flxdata, function(d) {return d.Weight});	
			}
			var weight2lw = scalePow()
				.exponent(pedge)
				.domain([0,wmax])
				.range([0,lwmax]);
				
			// var xfac = (totheight-paddingTop-paddingBottom)/(tllim[1]-tllim[0])

			// Color scale: If nodes have a cval property, use that with a 
			// continuous color scale (by default, blue-pink-yellow one on the 
			// domain of 0-1).  Otherwise, use node type for color.  Flux lines 
			// without a cval property match the value of their source node.
				
			var coltype = scaleOrdinal()
				.domain([0,1,2,3])
				.range(["#b3cde3", "#ccebc5", "#fbb4ae", "#decbe4"])
				.unknown("#ffffff");

			var colval = scaleLinear()
				.domain([0,1])
				.interpolate(interpolateHcl)
				.range([rgb("#007AFF"), rgb('#FFF500')]);
				
			if ('cval' in nodedata[0]) {
				if (typeof colfun === "number" & isNaN(colfun)) {
					colfun = colval;
				}
			} else {
				for (var ii = 0; ii < nodedata.length; ii++) {
					nodedata[ii].cval = nodedata[ii].type;
				}
				if (typeof colfun === "number" & isNaN(colfun)) {
					colfun = coltype;
				}
			}
			
			if (!('cval' in flxdata[0])) {
				for (ii = 0; ii < flxdata.length; ii++) {
					for (jj = 0; jj < nodedata.length; jj++) {
						if (flxdata[ii].source == nodedata[jj].id) {
							flxdata[ii].cval = nodedata[jj].cval;
						}
					}
				}
			}

			// Format line data as needed for line

			var linefun = line()
			    .x(function(d) { return d.x; })
			    .y(function(d) { return d.y; });
					
					
			for(var ii = 0; ii < flxdata.length; ii++ ) {
				flxdata[ii].xy = [];
				if ('xpath' in flxdata[0]) {
					for (var jj =0; jj < flxdata[ii].xpath.length; jj++) {
						flxdata[ii].xy.push({x: flxdata[ii].xpath[jj], y: flxdata[ii].ypath[jj]});
					} 
				} else {
					for (var kk = 0; kk < nodedata.length; kk++) {
						if (flxdata[ii].source == nodedata[kk].id | flxdata[ii].target == nodedata[kk].id) {
							flxdata[ii].xy.push({x: nodedata[kk].x, y: nodedata[kk].y});
						}
					}
				}
			}

			// Add axis

			svg.append("g")
				.attr("class", "y-axis")
				.attr("transform", "translate(" + (paddingLeft) + ", 0)")
				.call(yAxis);
			
			// Initialize tooltip
			
			var mytip = tip()
				.attr("class", "d3-tip")
				.offset([-10, 0])
				.html(function(d) {return "<strong>" + d.id + "</strong><br><br>" + "B: " + d.B + "<br>" + "TL: " + d.TL });
				 				 				 
			svg.call(mytip);
				
			// Plot links

			var flink = svg.append("g")
					.attr("class", "flinks")
				.selectAll("path").data(flxdata).enter().append("path")
					.attr("fill", "none")
					.attr("stroke", function(d) { return colfun(d.cval); })
					.attr("stroke-width", function(d) {return weight2lw(d.Weight); })
					.attr("d", function(d) { return linefun(d.xy); })
					.attr("opacity", 0.3);
				 
			// Plot nodes, including hover behavior
						
			var node = svg.append("g")
					.attr("class", "nodes")
				.selectAll("circle").data(nodedata).enter().append("circle")
					.attr("class", "nodecircle")
					.attr("r", function(d) {return b2r(d.B); })
					.style("fill", function(d) { return colfun(d.cval); })
					.style("stroke", "white")
					.style("stroke-width", 0.5)
					.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; })
					.on("mouseover", function (d) {
						node
							.style("fill", "gray")
							.style("opacity", 0.3);
						select(this)
							.style("fill", function(d) { return colfun(d.cval); })
							.style("opacity", 1); 
						flink
							.style("stroke", function(o) {
								if (o.source == d.id){
									return "blue";
								} else if (o.target == d.id) {
									return "red";
								} else {
									return "gray";
								}
							})
							.style("opacity", function(o) { return (o.source==d.id | o.target == d.id ? 1 : 0.1); });
						mytip.show(d);
					})
					.on("mouseout", function (d) {
						flink
							.style("stroke", function(o) { return colfun(o.cval); })
							.style("opacity", 0.3);
						node
							.style("opacity", 1)
							.style("fill", function(o) { return colfun(o.cval); });
						mytip.hide(d);
						
					});
			
			
		}); // end selection.each
	} // end chart

	//----------------------------
	// Fill in user-set variables
	//----------------------------
	
	chart.paddingLeft = function(value) {
			if (!arguments.length) return paddingLeft;
			paddingLeft = value;
			return chart;
	};
	chart.paddingRight = function(value) {
			if (!arguments.length) return paddingRight;
			paddingRight = value;
			return chart;
	};
	chart.paddingTop = function(value) {
			if (!arguments.length) return paddingTop;
			paddingTop = value;
			return chart;
	};
	chart.paddingBottom = function(value) {
			if (!arguments.length) return paddingBottom;
			paddingBottom = value;
			return chart;
	};
	chart.tllim = function(value) {
			if (!arguments.length) return tllim;
			tllim = value;
			return chart;
	};
	chart.rlim = function(value) {
			if (!arguments.length) return rlim;
			rlim = value;
			return chart;
	};
	chart.blim = function(value) {
			if (!arguments.length) return blim;
			blim = value;
			return chart;
	};
	chart.totwidth = function(value) {
			if (!arguments.length) return totwidth;
			totwidth = value;
			return chart;
	};
	chart.totheight = function(value) {
			if (!arguments.length) return totheight;
			totheight = value;
			return chart;
	};
	chart.colfun = function(value) {
			if (!arguments.length) return colfun;
			colfun = value;
			return chart;
	};

	chart.lwmax = function(value) {
			if (!arguments.length) return lwmax;
			lwmax = value;
			return chart;
	};
	chart.wmax = function(value) {
			if (!arguments.length) return wmax;
			wmax = value;
			return chart;
	};
	chart.pedge = function(value) {
			if (!arguments.length) return pedge;
			pedge = value;
			return chart;
	};

	return chart;

} // end foodwebstatic