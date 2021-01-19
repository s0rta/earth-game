Array.prototype.delete = function (arr) {
    var t = [];
    for (let j = 0; j < this.length; ++j) {
        let f = false;
        for (let i = 0; i < arr.length; ++i) {
            if (j == arr[i]) {
                f = true
            }
        }
        if (!f) {
            t.push(this[j])
        }
    }
    return t;
}

let level = 1
let biomass = 0
let distance = 200
let strength = 0.5

document.getElementById("level").innerHTML = level;

let nodeLists = [nodeList1, nodeList2, nodeList3, nodeList4, nodeList5, nodeList6, nodeList7];
let edgeLists = [edgeList1, edgeList2, edgeList3, edgeList4, edgeList5, edgeList6, edgeList7];
let colorArr = [...colors]

const es = ["", "wave attenuation", "shoreline protection", "shoreline stabilization", "carbon sequestration", "water filtration", "commfishery", "birdwatching", "waterfowl hunting", "recfishery", "recreational fishery", "commercial fishery", "carbon storage"]


let svg = d3.select("#svgMain"),
    w = 1000,
    h = 750,
    nodesArray = nodeLists[level - 1],
    linksArray = edgeLists[level - 1]

svg.attr('width', w)
    .attr('height', h)

var simulation = d3.forceSimulation(nodesArray)
    .force("charge", d3.forceManyBody().strength(-200))
    .force("link", d3.forceLink(linksArray).distance(distance))
    .force("center", d3.forceCenter(w / 2, h / 2))
    .force("x", d3.forceX(w / 2))
    .force("y", d3.forceY(h / 2))
    .on("tick", ticked);
var rect = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", w)
    .attr("height", h)
    .attr('fill', '#ccc')
var g_links = svg.append("g")
    .attr("class", "links")
var g_nodes = svg.append("g")
    .attr("class", "nodes")


var links = g_links.selectAll("line")
    .data(linksArray)
    .enter().append("line")
    .attr("x2", (d) => {
        return d.source.x;
    })
    .attr("y2", (d) => {
        return d.source.y;
    })
    .attr("x1", (d) => {
        return d.target.x;
    })
    .attr("x1", (d) => {
        return d.target.y;
    }).attr("class", d => d.Type == "Feeding" ? "line-feeding" : "line-es").attr('marker-start', 'url(#arrowhead)');

var nodes = g_nodes.selectAll(".nodes")
    .data(nodesArray)
    .enter().append("path")
    .attr("d", d3.symbol().size(300).type((d) => {
        let transformed = d.nodeName.toLowerCase().split("-").join(" ")
        let test = es.includes(transformed) ? d3.symbolSquare : d3.symbolCircle
        return test
    }))
    .attr("fill", d => {
        let color = colors.find(c => {
            return c.name == d.nodeColor
        })
        return color ? color.hex : "#00f"
    })
    .on("mouseover", handleMouseOver).on("mouseout", handleMouseOut).on("click", remove).on("contextmenu", function (d, i) {
        d3.event.preventDefault();
        simulation.stop()
        createSubSim(d)
    });

rect.on("click", add, true)

function createSubSim(mainNode) {
    let subSvg = d3.select("#svgSub"),
    w = 500,
    h = 250,
    simpleNodes = [],
    linksArray = edgeLists[level - 1].filter(l => {
        if(l.source.speciesID === mainNode.speciesID || l.target.speciesID === mainNode.speciesID) {
            simpleNodes.push(l.source.speciesID)
            simpleNodes.push(l.target.speciesID)
            return true
        }
        return false 
    }),
    nodesArray = nodeLists[level - 1].filter(l => {
        return simpleNodes.includes(l.speciesID)
    })

    subSvg.attr('width', w)
        .attr('height', h)
    let simulation = d3.forceSimulation(nodesArray)
        .force("charge", d3.forceManyBody().strength(-200))
        .force("link", d3.forceLink(linksArray).distance(distance / 2))
        .force("center", d3.forceCenter(w / 2, h / 2))
        .force("x", d3.forceX(w / 2))
        .force("y", d3.forceY(h / 2))
        .on("tick", ticked);
    let rect = subSvg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr('fill', '#ccc')
    let g_links = subSvg.append("g")
        .attr("class", "links")
    let g_nodes = subSvg.append("g")
        .attr("class", "nodes")


    let links = g_links.selectAll("line")
        .data(linksArray)
        .enter().append("line")
        .attr("x2", (d) => {
            return d.source.x;
        })
        .attr("y2", (d) => {
            return d.source.y;
        })
        .attr("x1", (d) => {
            return d.target.x;
        })
        .attr("x1", (d) => {
            return d.target.y;
        }).attr("class", d => d.Type == "Feeding" ? "line-feeding" : "line-es").attr('marker-start', 'url(#arrowhead)');

    let nodes = g_nodes.selectAll(".nodes")
        .data(nodesArray)
        .enter().append("path")
        .attr("fill", d => {
            let color = colors.find(c => {
                return c.name == d.nodeColor
            })
            return color ? color.hex : "#00f"
        })
        .attr("d", d3.symbol().size(300).type((d) => {
            let transformed = d.nodeName.toLowerCase().split("-").join(" ")
            let test = es.includes(transformed) ? d3.symbolSquare : d3.symbolCircle
            return test
        })).on("mouseover", handleMouseOver).on("mouseout", handleMouseOut)
        
        function ticked() {
            nodes.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            links = g_links.selectAll("line")
                .attr("x2", (d) => {
                    return d.source.x;
                })
                .attr("y2", (d) => {
                    return d.source.y;
                })
                .attr("x1", (d) => {
                    return d.target.x;
                })
                .attr("y1", (d) => {
                    return d.target.y;
                })
        }
}

function reDraw() {

    g_nodes.selectAll("path").remove();
    g_links.selectAll("line").remove();
    var update_nodes = g_nodes.selectAll("path")
        .data(nodesArray);

    update_nodes.exit().remove();

    nodes = update_nodes.enter()
        .append("path")
        .attr("d", d3.symbol().size(300).type((d) => {
            let transformed = d.nodeName.toLowerCase().split("-").join(" ")
            let test = es.includes(transformed) ? d3.symbolSquare : d3.symbolCircle
            return test
        }))
        .attr("fill", d => {
            let color = colors.find(c => {
                return c.name == d.nodeColor
            })
            return color ? color.hex : "#00f"
        })
        .on("mouseover", handleMouseOver).on("mouseout", handleMouseOut).on("click", remove).on("contextmenu", function (d, i) {
            d3.event.preventDefault();
            simulation.stop()
            createSubSim(d)
        })
        .merge(update_nodes);

    var update_links = g_links.selectAll("line")
        .data(linksArray)

    update_links.exit().remove()

    links = update_links.enter()
        .append("line")
        .attr("class", d => d.Type == "Feeding" ? "line-feeding" : "line-es")
        .merge(update_links)
        .attr('marker-start', 'url(#arrowhead)')
}

function findBiomass(sID) {
    let b = 0

    const biomassLinks = g_links.selectAll("line").data().filter(l => {
        return l.Type === "ES" ? l.source.speciesID === sID : false
    })

    biomassLinks.map(n => {
        b += n.target.biomass == -1 ? 0 : n.target.biomass
        return n.target.biomass
    })

    return b
}

function ticked() {
    nodes.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
    links = g_links.selectAll("line")
        .attr("x2", (d) => {
            return d.source.x;
        })
        .attr("y2", (d) => {
            return d.source.y;
        })
        .attr("x1", (d) => {
            return d.target.x;
        })
        .attr("y1", (d) => {
            return d.target.y;
        })
}

function remove(n, i) {
    d3.event.bubbles = false;
    if (d3.event.target.tagName == "path") {
        d3.event.stopPropagation();
    }
    var linkIndex = linksArray.filter((d) => {
        return (d.target.index == i || d.source.index == i);
    })

    linksArray = linksArray.delete(linkIndex.map((d) => {
        return d.index;
    }))
    nodesArray = nodesArray.delete([i]);

    simulation.nodes(nodesArray);
    simulation.force("link", d3.forceLink(linksArray).distance(distance).strength(strength))
    simulation.alpha(0.5);
    simulation.restart();

    reDraw();

    plotLife++
    plotStarts.forEach(obj => {
        drawPlot(obj)
    })
}

function levelDown() {
    if (level != 1) {
        level--
        add(level)
        document.getElementById("level").innerHTML = level;
        plotData = [{
            x: 1,
            y: findBiomass()
        }, {
            x: 2,
            y: findBiomass()
        }]
        plotLife = 2
        plotStarts.forEach(obj => {
            obj.data = []
            drawPlot(obj)
        })
    }

}

function levelUp() {
    if (level != 7) {
        level++
        add(level)
        document.getElementById("level").innerHTML = level;
        plotData = [{
            x: 1,
            y: findBiomass()
        }, {
            x: 2,
            y: findBiomass()
        }]
        plotLife = 2
        plotStarts.forEach(obj => {
            obj.data = []
            drawPlot(obj)
        })
    }
}

function add(l) {
    linksArray = [...edgeLists[l - 1]];
    nodesArray = [...nodeLists[l - 1]];

    simulation.nodes(nodeLists[l - 1]);
    simulation.force("link", d3.forceLink(linksArray).distance(distance).strength(strength))
    simulation.alpha(0.5);
    simulation.restart();

    reDraw();
}

function handleMouseOver(d, i) {
    d3.select(this).attr("class", "hover");
    d3.select("span.name-filler").text(d.nodeName)
    d3.select("span.type-filler").text(d.organismType)
    d3.select("span.biomass-filler").text(d.biomass)
    d3.select("span.trophic-filler").text(d.trophicLevel)
    d3.select("img.photo").attr("src", "img/Images/" + d.imgFile)
    d3.select("p.desc").text(d.desc)
}

function handleMouseOut(d, i) {
    d3.select(this).classed("hover", false);
    d3.select("span.name-filler").text("")
    d3.select("span.type-filler").text("")
    d3.select("span.biomass-filler").text("")
    d3.select("span.trophic-filler").text("")
    d3.select("p.desc").text("")
    d3.select("img.photo").attr("src", "")
}

/* PLOT MAIN CODE */
let plotLife = 2

const plotMargin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60
    },
    plotWidth = 460 - plotMargin.left - plotMargin.right,
    plotHeight = 400 - plotMargin.top - plotMargin.bottom;

const plotStarts = [{
    name: "waterfowl-hunting",
    id: 950,
    data: [],
    top: findBiomass(950)
}, {
    name: "birdwatching",
    id: 850,
    data: [],
    top: findBiomass(850)
}, {
    name: "commercial-fishery",
    id: 750,
    data: [],
    top: findBiomass(750)
}, {
    name: "recreational-fishery",
    id: 1050,
    data: [],
    top: findBiomass(1050)
}, {
    name: "carbon-storage",
    id: 550,
    data: [],
    top: findBiomass(550)
}, {
    name: "wave-attenuation",
    id: 350,
    data: [],
    top: findBiomass(350)
}, {
    name: "water-filtration",
    id: 650,
    data: [],
    top: findBiomass(650)
}]

plotStarts.forEach(obj => {
    drawPlot(obj)
})

function drawPlot(plot) {
    const plotTop = findBiomass(plot.id)

    plot.data.push({
        x: plotLife - 1,
        y: plotTop
    })
    plot.data.push({
        x: plotLife,
        y: plotTop
    })


    d3.selectAll("svg." + plot.name).remove()

    // append the svg object to the body of the page
    let plotSvg = d3.select("." + plot.name)
        .append("svg")
        .attr("class", plot.name)
        .attr("width", plotWidth + plotMargin.left + plotMargin.right)
        .attr("height", plotHeight + plotMargin.top + plotMargin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + plotMargin.left + "," + plotMargin.top + ")");

    let plotX = d3.scaleLinear()
        .domain([1, plotLife])
        .range([0, plotWidth]);

    let plotY = d3.scaleLinear()
        .domain([0, plot.top])
        .range([plotHeight, 0])

    plotSvg.append("g")
        .attr("transform", "translate(0," + plotHeight + ")")
        .call(d3.axisBottom(plotX));

    plotSvg.append("g")
        .call(d3.axisLeft(plotY));

    plotSvg
        .append("path")
        .datum(plot.data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => plotX(d.x))
            .y(d => plotY(d.y))
        )
}