let level = 1

d3.select(".level").text(level)

const es = ["", "wave attenuation", "shoreline stabilization", "carbon sequestration", "water filtration", "commfishery", "birdwatching", "waterfowl hunting", "recfishery", "recreational fishery", "commercial fishery", "carbon storage"]

let nodeLists = [nodeList1, nodeList2, nodeList3, nodeList4, nodeList5, nodeList6, nodeList7];
let edgeLists = [edgeList1, edgeList2, edgeList3, edgeList4, edgeList5, edgeList6, edgeList7];

let width = 800,
    height = 800,
    root

var svg = d3.select("div#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
}

let graph = {
    nodes: nodeLists[level - 1],
    links: edgeLists[level - 1]

}

let link = svg
    .selectAll(".link")
    .data(graph.links)
    .join("line")
    .classed("link-feeding", d => d.Type == "Feeding")
    .classed("link-es", d => d.Type == "ES")
node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("path")
    .attr("class", "node")
    .attr("d", d3.symbol().size(300).type((d) => {
        let transformed = d.groupName.toLowerCase().split("-").join(" ")
        let test = es.includes(transformed) ? d3.symbolCircle : d3.symbolSquare
        return test
    }))
    .classed("node", true)
    .classed("fixed", false);


let simulation = d3
    .forceSimulation()
    .nodes(graph.nodes)
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(graph.links))
    .on("tick", tick);

const drag = d3
    .drag()
    .on("start", dragstart)
    .on("drag", dragged);

node.call(drag).on("click", click).on("mouseover", handleMouseOver).on("mouseout", handleMouseOut);

function tick() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
}

function click(event, d) {
    d3
    delete d.fx;
    delete d.fy;
    d3.select(this).classed("fixed", false);
    simulation.restart();
}

function dragstart() {
    d3.select(this).classed("fixed", true);
}

function dragged(event, d) {
    d.fx = clamp(event.x, 0, width);
    d.fy = clamp(event.y, 0, height);
    simulation.alpha(0.5).restart();
}

function handleMouseOver(d, i) {
    d3.select(this).classed("hover", true);
    d3.select("h2.name").data(d3.select(this)).text(d => d.__data__.groupName)
    d3.select("p.id").data(d3.select(this)).text(d => d.__data__.speciesID)
    d3.select("p.biomass").data(d3.select(this)).text(d => d.__data__.biomass)
}

function handleMouseOut(d, i) {
    d3.select(this).classed("hover", false);
    d3.select("h2.name").text("name")
    d3.select("p.id").text("ID")
    d3.select("p.biomass").text("biomass")
}

function levelUp() {
    if (level != 7) {
        level++
        graph.nodes = nodeLists[level - 1]
        graph.links = edgeLists[level - 1]
        simulation.restart();
    }
}

function levelDown() {
    resetSim()

}

function reDraw() {
    var update_nodes = nodes.selectAll("circle")
      .data(nodesArray);
    update_nodes.exit().remove();
    nodes = update_nodes.enter()
      .append("circle")
      .merge(update_nodes);
    var update_links = g_links.selectAll("line")
      .data(linksArray);
    update_links.exit().remove()
    links = update_links.enter()
      .append("line")
      .merge(update_links)
  }