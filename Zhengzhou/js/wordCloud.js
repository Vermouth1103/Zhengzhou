var wordCloud = {
    "obj": null,
    "svg": null,
    "properties": {
        "width": null,
        "height": null,
        "range": null
    },
    "func": {
        "layout": null,
        "painter": null,
    }
};

var dataSet = [
    {id: "丰田-花冠-2013", count: 444476},
    {id: "误检-公交车顶（车头）", count: 207412},
    {id: "宇通-ZK6180HGC（车头）", count: 190502},
    {id: "大众-桑塔纳经典-19902007（车头）", count: 74909},
    {id: "载货车类（车尾）", count: 70164},
    {id: "大众-桑塔纳-20132015(低配版)（车头）", count: 67423},
    {id: "丰田-卡罗拉-2014", count: 60662},
    {id: "大众-帕萨特-20112015", count: 59775},
    {id: "日产-轩逸-2016", count: 51269},
    {id: "大众-桑塔纳-20132015（车尾）", count: 51133},
    {id: "大众-途观-20132015", count: 48518},
    {id: "五菱-荣光-2012（车头）", count: 47809},
    {id: "奥迪-A6L-20122014", count: 46399},
    {id: "丰田-花冠-20102011", count: 46065},
    {id: "大众-迈腾-20122016（车头）", count: 45885},
    {id: "起亚-K3-2016", count: 45378},
    {id: "五菱-宏光V-2015", count: 44177},
    {id: "大众-速腾-20122014", count: 43651},
    {id: "五菱-荣光-20112012（车尾）", count: 41466},
    {id: "福特-福睿斯-2015", count: 40029}
];

wordCloudInit("word-cloud", 347, 347);

function wordCloudSizeInterpolate(weight) {
    if(weight<=0.12){
        weight = weight * 5;
        var compute = d3.scale.linear()
            .domain([0, 1])
            .range([10, 20]);
        return compute(weight);
    }
    else{
        weight = (weight - 0.12) * 100 / 88;
        var compute = d3.scale.linear()
            .domain([0, 1])
            .range([25, 40]);
        return compute(weight);
    }
}

function wordCloudInit(obj, width, height){
    console.log(dataSet);

    d3.csv("data/cartype.csv", function (error, data) {
       if(error){
           throw error;
       }
       else{
           // console.log(data);
           wordCloud.obj = obj;
           wordCloud.svg = d3.select("."+wordCloud.obj).append("svg")
               .attr("width", width)
               .attr("height", height);

           wordCloud.func.painter = d3.scale.category20c();
           wordCloud.func.layout = d3.layout.cloud()
               .words(dataSet.map(function (d) {
                   return {text: d.id, size: (~~wordCloudSizeInterpolate(d.count/444476))};
               }))  // 数据
               .padding(5)  // 内间距
               .rotate(function() { return ~~(Math.random()) * 90; })
               .font("Impact")
               .fontSize(function(d) {
                   return d.size;
               })
               .on("end", draw);

           wordCloud.func.layout.start();
       }
    });

    // wordCloud.obj = obj;
    // wordCloud.svg = d3.select("."+wordCloud.obj).append("svg")
    //     .attr("width", width)
    //     .attr("height", height);
    //
    // wordCloud.func.painter = d3.scale.category20c();
    // wordCloud.func.layout = d3.layout.cloud()
    //     .words(dataSet.map(function (d) {
    //         console.log(d.id, d.count, ~~wordCloudSizeInterpolate(d.count/444476));
    //         return {text: d.id, size: (~~wordCloudSizeInterpolate(d.count/444476))};
    //         // return {text: d.id, size: 10 + Math.random() * 90};
    //     }))  // 数据
    //     .padding(5)  // 内间距
    //     .rotate(function() {
    //         return ~~(Math.random() * 2) * 90;
    //     })
    //     .font("Impact")
    //     .fontSize(function(d) {
    //         return d.size;
    //     })
    //     .on("end", draw)
    //     .start();
}

function draw(words) {
    console.log(words);
    wordCloud.svg.append("g")
        .attr("transform", "translate(150,150)")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return wordCloud.func.painter(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
            return d.text;
        });
}