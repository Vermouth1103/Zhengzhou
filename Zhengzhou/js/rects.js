var rectMap = {
    "obj": null,
    "svg": null,
    "properties": {
        "gridSize": 1,
        "width": 0,
        "height": 0,
        "margin": {top: 30, right: 0, bottom: 0, left: 50}
    },
    "axis": {
        "times": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]
    },
    "tooltip": null,
    "event": {
        "click": function () {
            return ;
        }
    }
};

var datalist = [
    "count_bayonet_2018030100_2018030101.csv",
    "count_bayonet_2018030101_2018030102.csv",
    "count_bayonet_2018030102_2018030103.csv",
    "count_bayonet_2018030103_2018030104.csv",
    "count_bayonet_2018030104_2018030105.csv",
    "count_bayonet_2018030105_2018030106.csv",
    "count_bayonet_2018030106_2018030107.csv",
    "count_bayonet_2018030107_2018030108.csv",
    "count_bayonet_2018030108_2018030109.csv",
    "count_bayonet_2018030109_2018030110.csv",
    "count_bayonet_2018030110_2018030111.csv",
    "count_bayonet_2018030111_2018030112.csv",
    "count_bayonet_2018030112_2018030113.csv",
    "count_bayonet_2018030113_2018030114.csv",
    "count_bayonet_2018030114_2018030115.csv",
    "count_bayonet_2018030115_2018030116.csv",
    "count_bayonet_2018030116_2018030117.csv",
    "count_bayonet_2018030117_2018030118.csv",
    "count_bayonet_2018030118_2018030119.csv",
    "count_bayonet_2018030119_2018030120.csv",
    "count_bayonet_2018030120_2018030121.csv",
    "count_bayonet_2018030121_2018030122.csv",
    "count_bayonet_2018030122_2018030123.csv",
    "count_bayonet_2018030123_2018030200.csv",
];

var graph = {
    "obj": null,
    "svg": null,
    "properties": {
        "width": 0,
        "height": 0,
        "padding": {top: 25, right: 55, bottom: 25, left: 55}
    }
};

var width = 775,
    height = 50;

var colorA = d3.rgb(255, 255, 0);
var colorB = d3.rgb(255, 150, 0);

var computeR = d3.scale.linear()
    .domain([1, 70000])
    .range([0, 10]);


var zoom = d3.behavior.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", function (d) {
        console.log(d3.event.translate);
        d3.select("g")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    });

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

function sizeInterpolate(weight) {
    if(weight<=0.2){
        weight = weight * 5;
        var compute = d3.scale.linear()
            .domain([0, 1])
            .range([0, 4]);
        return compute(weight);
    }
    else{
        weight = (weight - 0.2) * 5 / 4;
        var compute = d3.scale.linear()
            .domain([0, 1])
            .range([5, 10]);
        return compute(weight);
    }
}


initial("hours", 10, 10, "hours-graph", 775, 120);
resize();

function initial(rectMapObj, rectMapWidth, rectMapHeight, graphObj, graphWidth, graphHeight){
    rectMap.obj = rectMapObj;
    rectMap.properties.width = rectMapWidth;
    rectMap.properties.height = rectMapHeight;
    graph.obj = graphObj;
    graph.properties.width = graphWidth;
    graph.properties.height = graphHeight;
    console.log("initial done");
}

function resize() {
    var computeHoursColor = d3.interpolate(d3.rgb(255,255,178), d3.rgb(235,91,30));
    var max = 0, min = 1000000;
    var hoursColorCount = [];
    d3.queue()
        .defer(d3.csv, "data/bayonet_hours.csv")
        .await(ready);

    function ready(error, data) {
        if(error){
            throw error;
        }
        // console.log(data);
        for (var i = 0; i < 24; i++) {
            hoursColorCount[i] = parseInt(data[i].bayonet);
            if (max < hoursColorCount[i]) {
                max = hoursColorCount[i];
            }
            if (min > hoursColorCount[i]) {
                min = hoursColorCount[i];
            }
        }
        console.log(max, min);

        var compute = d3.scale.linear()
            .domain([min, max])
            .range([0, 1]);

        rectMap.svg = d3.select("." + rectMap.obj).append("svg")
            .attr("width", width)
            .attr("height", height);
        // console.log(rectMap.svg);

        rectMap.svg.selectAll("text")
            .data(rectMap.axis.times)
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return 140 + rectMap.properties.gridSize * i * 20;
            })
            .attr("y", 17)
            .style("text-anchor", "middle")
            .attr("fill", "white");

        for (var i = 0; i < 24; i++) {
            // console.log(i, hoursColorCount[i]);
            rectMap.svg.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("stroke", "#2F4F4F")
                .attr("stroke-width", 1)
                .attr("id", i)
                .attr("class", "rect" + (i + 1))
                .attr("x", 133 + rectMap.properties.gridSize * i * 20)
                .attr("y", 25)
                .attr("fill", computeHoursColor(compute(hoursColorCount[i])))
                .on("mouseover", function () {
                    tooltip.html("总通过量<br/>" + hoursColorCount[parseInt(d3.select(this)[0][0].id)])
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity", 1.0);
                })
                .on("mousemove", function () {
                    tooltip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                })
                .on("mouseout", function () {
                    tooltip.style("opacity", 0.0);
                })
                .on("click", function () {
                    var points = d3.select(".map-area").select("svg").select("g").selectAll("g");
                    // console.log(points);
                    points.remove();
                    d3.csv("data/" + datalist[parseInt(d3.select(this)[0][0].id)], function (error, data) {
                        if (error) {
                            throw error;
                        }
                        else {
                            var points = groups.selectAll("point")
                                .data(data)
                                .enter()
                                .append("g")
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
                                .on("mousemove", function () {
                                    tooltip.style("left", (d3.event.pageX) + "px")
                                        .style("top", (d3.event.pageY + 20) + "px")
                                })
                                .on("mouseout", function () {
                                    tooltip.style("left", "0px");
                                    tooltip.style("top", "0px");
                                    tooltip.style("opacity", 0.0);
                                });
                            points.append("circle")
                                .attr("r", function (d) {
                                    return sizeInterpolate(d.weight);
                                })
                                .style("fill", function (d) {
                                    return colorInterpolate(d.weight);
                                });

                            groups.call(zoom)
                        }
                    })
                })
        }

        rectMap.svg.append("text")
            .text("reset")
            .attr("x", function (d, i) {
                return 148 + rectMap.properties.gridSize * 24 * 20;
            })
            .attr("y", 17)
            .style("text-anchor", "middle")
            .attr("fill", "white");

        rectMap.svg.append("rect")
            .attr("width", 30)
            .attr("height", 15)
            .attr("stroke", "#2F4F4F")
            .attr("stroke-width", 1)
            .attr("id", "reset")
            .attr("class", "rect-reset")
            .attr("x", 133 + rectMap.properties.gridSize * 24 * 20)
            .attr("y", 25)
            .attr("fill", "yellow")
            .on("click", function () {
                var points = d3.select(".map-area").select("svg").select("g").selectAll("g");
                // console.log(points);
                points.remove();

                d3.csv("data/geoCounts.csv", function (error, data) {
                    if (error) {
                        throw error;
                    }
                    else {
                        var points = groups.selectAll("point")
                            .data(data)
                            .enter()
                            .append("g")
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
                            .on("mouseout", function () {
                                tooltip.style("left", "0px");
                                tooltip.style("top", "0px");
                                tooltip.style("opacity", 0.0);
                            });
                        points.append("circle")
                            .attr("r", function (d) {
                                return computeR(d.count);
                            })
                            .style("fill", function (d) {
                                return colorInterpolate(d.weight);
                            });

                        groups.call(zoom)
                    }
                })
            });

        console.log(graph.obj);
        graph.svg = d3.select("."+graph.obj).append("svg")
            .attr("width", graph.properties.width)
            .attr("height", graph.properties.height);

        var g = graph.svg.append("g")
            .attr("transform", "translate("+graph.properties.padding.left+","+graph.properties.padding.top+")");

        var xScale = d3.scale.linear()
            .domain([1, 24])
            .range([0, graph.properties.width - graph.properties.padding.left - graph.properties.padding.right]);

        var yScale = d3.scale.linear()
            .domain([0, max])
            .range([graph.properties.height - graph.properties.padding.top - graph.properties.padding.bottom, 0]);

        var xAxis = d3.svg.axis()
            .ticks(24)
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .ticks(3)
            .scale(yScale)
            .orient("left");

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,"+(graph.properties.height-graph.properties.padding.top-graph.properties.padding.bottom)+")")
            .call(xAxis);

        g.append("g")
            .attr("class", "axis")
            .call(yAxis);

        var linePath = d3.svg.line()
            .x(function (d, i) {
                return xScale(i+1);
            })
            .y(function (d) {
                return yScale(d);
            })
            .interpolate("cardinal");

        g.append("path")
            .attr("class", "line")
            .attr("d", linePath(hoursColorCount))
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", "gray");

        console.log(hoursColorCount);


        g.append("g")
            .selectAll("circle")
            .data(hoursColorCount)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("transform", function (d, i) {
                return "translate("+(xScale(i+1))+","+(yScale(d))+")";
            })
            .attr("fill", function (d) {
                return colorInterpolate(d/max);
            })
            .on("mouseover", function (d) {
                tooltip.html("总通过量<br/>" + d)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 50) + "px")
                    .style("opacity", 1.0);
            })
            .on("mousemove", function () {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 50) + "px")
            })
            .on("mouseout", function () {
                tooltip.style("left", "0px");
                tooltip.style("top", "0px");
                tooltip.style("opacity", 0.0);
            });
    }
}

