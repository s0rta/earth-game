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
let distance = 20
let strength = 0.5

document.getElementById("level").innerHTML = level;

let nodeLists = [nodeList1, nodeList2, nodeList3, nodeList4, nodeList5, nodeList6, nodeList7];
let edgeLists = [edgeList1, edgeList2, edgeList3, edgeList4, edgeList5, edgeList6, edgeList7];

const es = ["", "wave attenuation", "shoreline stabilization", "carbon sequestration", "water filtration", "commfishery", "birdwatching", "waterfowl hunting", "recfishery", "recreational fishery", "commercial fishery", "carbon storage"]


let svg = d3.select("svg"),
    w = 1000,
    h = 750
    n = 50,
    nodesArray = nodeLists[level - 1],
    linksArray = edgeLists[level - 1],
svg.attr('width', w)
    .attr('height', h)
var simulation = d3.forceSimulation(nodesArray)
    .force("charge", d3.forceManyBody().strength(-500))
    .force("link", d3.forceLink(linksArray).distance(distance))
    .force("center", d3.forceCenter(w/2, h/2))
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
    .attr("class", "links");
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
    }).attr("class", d => d.Type == "Feeding" ? "line-feeding" : "line-es")

var nodes = g_nodes.selectAll(".nodes")
    .data(nodesArray)
    .enter().append("path")
    .attr("d", d3.symbol().size(300).type((d) => {
        let transformed = d.groupName.toLowerCase().split("-").join(" ")
        let test = es.includes(transformed) ? d3.symbolCircle : d3.symbolSquare
        return test
    }))
    .on("mouseover", handleMouseOver).on("mouseout", handleMouseOut).on("click", remove);

rect.on("click", add, true)

function reDraw() {

    svg.selectAll("path").remove();
    svg.selectAll("line").remove();
    console.log(nodesArray)
    var update_nodes = g_nodes.selectAll("path")
        .data(nodesArray);

    update_nodes.exit().remove();

    nodes = update_nodes.enter()
        .append("path")
        .attr("d", d3.symbol().size(300).type((d) => {
            let transformed = d.groupName.toLowerCase().split("-").join(" ")
            let test = es.includes(transformed) ? d3.symbolCircle : d3.symbolSquare
            return test
        })).on("mouseover", handleMouseOver).on("mouseout", handleMouseOut).on("click", remove)
        .merge(update_nodes);

    var update_links = g_links.selectAll("line")
        .data(linksArray);
        
    update_links.exit().remove()

    links = update_links.enter()
        .append("line")
        .attr("class", d => d.Type == "Feeding" ? "line-feeding" : "line-es")
        .merge(update_links)
}

function findBiomass(d, i) {
    let b = 0
    d3.selectAll("path").data().map(n => {
        b += n.biomass
        return n.biomass
    })

    return b
}

function ticked() {
    biomass = findBiomass()
    d3.select(".total-biomass").html(biomass)
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
}

function levelDown() {
    if (level != 1) {
        level--
        add(level)
        document.getElementById("level").innerHTML = level;
    }
}

function levelUp() {
    if (level != 7) {
        level++
        add(level)
        document.getElementById("level").innerHTML = level;
    }
}

function add(l) {
    linksArray = [...edgeLists[l - 1]];
    nodesArray = [...nodeLists[l - 1]];

    console.log(nodesArray)
    
    simulation.nodes(nodeLists[l - 1]);
    simulation.force("link", d3.forceLink(linksArray).distance(distance).strength(strength))
    simulation.alpha(0.5);
    simulation.restart();

    reDraw();
}

function handleMouseOver(d, i) {
    d3.select(this).attr("class", "hover");
    d3.select("h2.name").text(d.groupName)
    d3.select("p.id").text(d.speciesID)
    d3.select("p.biomass").text(d.biomass)
}

function handleMouseOut(d, i) {
    d3.select(this).classed("hover", false);
    d3.select("h2.name").text("name")
    d3.select("p.id").text("ID")
    d3.select("p.biomass").text("biomass")
}