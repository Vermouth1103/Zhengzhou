var scale = 75000,
    center = [113.60,34.73];

var width = 776,
    height = 496;

var svg = d3.select(".map-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var groups = svg.append("g");

var projection = d3.geo.mercator()
    .center(center)
    .scale(scale)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);

var colorA = d3.rgb(255, 255, 0);
var colorB = d3.rgb(255, 150, 0);

var computeR = d3.scale.linear()
    .domain([1, 70000])
    .range([0, 10]);

function colorInterpolate(weight) {
    if(weight<=0.2){
        weight = weight * 5;
        var compute = d3.interpolate(d3.rgb(255,255,178),d3.rgb(253,141,60));
        return compute(weight);
    }
    else{
        weight = (weight - 0.2) * 5 / 4;
        var compute = d3.interpolate(d3.rgb(253,141,60),d3.rgb(177,0,38));
        return compute(weight)
    }
}

var zoom = d3.behavior.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", function (d) {
        console.log(d3.event.translate);
        d3.select("g")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    });

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.0);

d3.queue()
    .defer(d3.json, "json/Zhengzhou_geo.json")
    .defer(d3.csv, "data/geoCounts.csv")
    .defer(d3.json, "json/Zhengzhou高速公路.json")
    .defer(d3.json, "json/Zhengzhou市区道路.json")
    .await(ready);

function ready(error, zhengzhou, count, gaosugonglu, shiqudaolu) {
    if(error){
        throw error
    }

    var zhengzhou = groups.selectAll("path")
        .data(zhengzhou.geometries)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "#0080BA")
        .attr("stroke-width", 2)
        .attr("fill", "#494A5F");

    // var gaosugonglu = groups.selectAll("path")
    //     .data(gaosugonglu.features)
    //     .enter()
    //     .append("path")
    //     .attr("stroke", "#0075B2")
    //     .attr("stroke-width", 1)
    //     .attr("d", path)
    //     .attr("fill", "none")
    //     .on("mouseover", function (d) {
    //         tooltip.html(d.properties.NAME)
    //             .style("left", (d3.event.pageX) + "px")
    //             .style("top", (d3.event.pageY + 20) + "px")
    //             .style("opacity", 1.0);
    //     })
    //     .on("mousemove", function (d) {
    //         tooltip.style("left", (d3.event.pageX) + "px")
    //             .style("top", (d3.event.pageY + 20) + "px")
    //     })
    //     .on("mouseout", function (d) {
    //         tooltip.style("opacity", 0.0)
    //     });

    var shiqudaolu = groups.selectAll("path")
        .data(shiqudaolu.features)
        .enter()
        .append("path")
        .attr("stroke", "#EDEDF9")
        .attr("stroke-width", 1)
        .attr("d", path)
        .attr("fill", "none")
        .style("opacity", 0.3)
        .on("mouseover", function (d) {
            tooltip.html(d.properties.NAME)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity", 1.0);
        })
        .on("mousemove", function (d) {
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.style("opacity", 0.0)
            d3.select(this)
                .style("fill", "none")
        });

    var points = groups.selectAll("point")
        .data(count)
        .enter()
        .append("g")
        .attr("name", "points")
        .attr("transform", function (d, i) {
            var coor = projection([d.longitude, d.latitude]);
            return "translate(" + coor[0] + "," + coor[1] + ")";
        })
        .on("mouseover", function (d, i) {
            tooltip.html(d.location + "<br />" + "通过量: " + d.count)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity", 1.0);
        })
        .on("mousemove", function (d) {
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
        })
        .on("mouseout", function (d, i) {
            tooltip.style("opacity", 0.0);
        });


    points.append("circle")
        .attr("r", function (d) {
            var number = d.count;
            return computeR(number);
        })
        .style("fill", function (d) {
            return colorInterpolate(d.weight);
        });

    groups.call(zoom)
}