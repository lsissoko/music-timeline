var data = [{"artist": "Kanye West",
"color":"#BADA55",
"albums":[{
    "date": "2013-06-18",
    "name": "Yeezus",
    "score": 85
}, {
    "date": "2010-11-22",
    "name": "My Beautiful Dark Twisted Fantasy",
    "score": 94
}, {
    "date": "2008-11-25",
    "name": "808s & Heartbreak",
    "score": 75
}, {
    "date": "2007-09-11",
    "name": "Graduation",
    "score": 79
}, {
    "date": "2005-08-30",
    "name": "Late Registration",
    "score": 85
}, {
    "date": "2004-02-10",
    "name": "College Dropout",
    "score": 87
}]},
{"artist": "Jay-Z",
"color":"#facade",
"albums":[{
    "date": "2013-07-04",
    "name": "Magna Carta Holy Grail",
    "score": 59
}, {
    "date": "2009-09-08",
    "name": "The Blueprint 3",
    "score": 65
}, {
    "date": "2007-11-06",
    "name": "American Gangster",
    "score": 83
}, {
    "date": "2003-11-14",
    "name": "The Black Album",
    "score": 84
},{
    "date": "2002-11-12",
    "name": "The BluePrint 2",
    "score": 64
},{
    "date": "2001-09-11",
    "name": "The Blueprint",
    "score": 88
},{
    "date": "2006-11-21",
    "name": "Kingdom Come",
    "score": 67
}]},
{"artist": "Lil Wayne",
"color":"#facade",
"albums":[{
    "date": "2008-06-10",
    "name": "Tha Carter III",
    "score": 84
}, {
    "date": "2011-09-29",
    "name": "Tha Carter IV",
    "score": 60
}, {
    "date": "2010-02-02",
    "name": "Rebirth",
    "score": 37
}, {
    "date": "2010-08-12",
    "name": "I Am Not a Human Being",
    "score": 67
},{
    "date": "2013-01-26",
    "name": "I Am Not a Human Being II",
    "score": 51
}]},
{"artist": "Drake",
"color":"#facade",
"albums":[{
    "date": "2013-09-24",
    "name": "Nothing Was the Same",
    "score": 79
}, {
    "date": "2011-11-15",
    "name": "Take Care",
    "score": 78
}, {
    "date": "2010-06-15",
    "name": "Thank Me later",
    "score": 75
}, {
    "date": "2009-02-13",
    "name": "So Far Gone",
    "score": 81
}]}];


var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var x = d3.time.scale().range([100, width]),
    x2 = d3.time.scale().range([100, width-margin.right-margin.left]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);



var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var xAxis2 = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var focus = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .attr('class','focus');
var context = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .attr('class','context');


var colorScale =d3.scale.category10();

x.domain([new Date("2000-02-10"), d3.time.day.offset(new Date("2014-06-18"), 1)])
    .rangeRound([100, width - margin.left - margin.right]);

y.domain([0, 100])
    .range([height - margin.top - margin.bottom, 0]);

  x2.domain(x.domain());
  y2.domain(y.domain());

focus.selectAll("line.verticalGrid").data(x.ticks(12)).enter()
    .append("line")
        .attr(
        {
            "class":"verticalGrid",
            "y1" : (height - margin.top - margin.bottom),
            "y2" : (height - margin.top - margin.bottom)-150,
            "x1" : function(d){ return x(d);},
            "x2" : function(d){ return x(d);},
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "opacity" : "0.5",
            "stroke" : "lightgrey",
            "stroke-width" : "1px"
        });

var charts = svg.selectAll('g');

var Artist = charts.selectAll('.chart')
    .data(data).enter().append('g')
    .attr("class",function(d,i){return "Artist"})
    .attr("data-name",function(d,i){return d.artist})
    .attr("fill",function(d,i){return colorScale(i)});
var artist_line = d3.selectAll('.Artist')
    .data(data).append('line')
    .attr('x1',100)
    .attr('x2',width - margin.left - margin.right)
    .attr('y1',function (d,i) {return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(i*15)+30)})
    .attr('y2',function (d,i) {return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(i*15)+30)})
    .attr("stroke","#CCC")
    .attr("stroke-width", 1);

Artist
    .selectAll("circle")
    .data(function(d){return d.albums})
    .enter().append('g').attr('class', 'album').append("circle")
    
    .attr('data-album', function(d,i){return d.name})
    .attr('r',function(d,i){return 13})
    .attr('cx', function (d,i) { 
    return x(new Date(d.date));
})
    .attr('cy', function (d,i,j) {
    return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(j*15)+30)
});
//Context Circle Size and Placement
Artist.selectAll(".context .album circle")
    .attr('r',function(d,i){return 5})
    .attr('cy', function (d,i,j) {
    return height2 - margin2.top - margin2.bottom - (height2 - margin2.top - margin2.bottom - y(j*5)+30)+180;});

//Focus Album Score labels
Artist.selectAll(".focus .album")
    .append("text")
    .attr('x', function (d,i) { return x(new Date(d.date))-8;})
    .attr('y', function (d,i,j) {
    return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(j*15)+25)
})
    .attr("stroke", "#FFF")
    .text(function(d){return d.score});

//Album Tooltip
Artist.selectAll(".focus .album")
    .on("mouseover", function(d){tooltip.text(d.name);return tooltip.style("visibility", "visible");})
.on("mousemove", function(){return tooltip.style("top",
    (d3.event.pageY-50)+"px").style("left",(d3.event.pageX-50)+"px");})
.on("mouseout", function(){return tooltip.style("visibility", "hidden");});


var artist_label = d3.selectAll('.Artist')
    .data(data).append('text')
    .text(function(d,i){return d.artist})
    .attr('x',0)
    .attr('y', function (d,i) {return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(i*15)+30)});



focus.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
    .call(xAxis);

context.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + (400) + ')')
    .call(xAxis2);

context.append('g')
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", 342)
      .attr("height", height2 + 7);

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  //update gridlines
  focus.selectAll(".verticalGrid")
  .attr("x1",function(d){ return x(d)})
  .attr("x2",function(d){ return x(d)});
  //update context circles
  focus.selectAll("circle").attr('cx', function (d,i) { 
    return x(new Date(d.date)) < 100 || x(new Date(d.date)) > (width-margin.right-margin.left) ? -9999 : x(new Date(d.date));
});
  //update circle labels
  focus.selectAll("text")
  .attr('x', function (d,i) { return x(new Date(d.date))-8;});

  focus.select(".x.axis").call(xAxis);
}
function make_x_axis() {        
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
}


var tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");
