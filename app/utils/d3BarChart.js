var d3 = require('d3');
var d3Chart = {};

d3Chart.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

  svg.append('g')
      .attr('class', 'd3-bars');

  this.update(el, state);
};

d3Chart.update = function(el, state) {
  // Re-compute the scales, and render the data points
  var scales = this._scales(el, state.domain);
  this._drawPoints(el, scales, state.data);
};


d3Chart.destroy = function(el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};


d3Chart._scales = function(el, domain) {
  if (!domain) {
    return null;
  }

  var width = el.offsetWidth;
  var height = el.offsetHeight;

  var x = d3.scale.ordinal()
        .domain(domain.x)
        .rangeRoundBands([0, width], .05)

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);

  return {x: x, y: y};
};


// d3Chart.js
d3Chart._drawPoints = function(el, scales, data) {
  var g = d3.select(el).selectAll('.d3-bars');
  var bar = g.selectAll('.d3-bar')
    .data(data, function(d) { return d.yvar; });


  // ENTER
  bar.enter().append('rect')  
      .attr('class', 'd3-bar')
      .style("fill", "#6beca4");

  // console.log("Hey Baby",scales.x.rangeBand())
  // ENTER & UPDATE
  bar.attr("x", function(d) { return scales.x(d.xvar); })
     .attr("width", scales.x.rangeBand())
     .attr("y", function(d) {return scales.y(d.yvar); })
     .attr("height", function(d) { return 300 - scales.y(d.yvar); });


  // EXIT
  bar.exit()
      .remove();
};

module.exports = d3Chart;
