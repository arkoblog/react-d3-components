
var React = require('react');
var ReactDOM = require('react-dom');

var Chart = React.createClass({
    propTypes: {
      data: React.PropTypes.array,
      domain: React.PropTypes.object,
      type: React.PropTypes.string
    },

    getChartType: function() {
      if(this.props.type == "Bar") {
        var d3Chart = require('../utils/d3BarChart');
      } else {
        var d3Chart = require('../utils/d3ScatterChart');
      }
      return d3Chart
    },
    componentDidMount: function() {
      var d3Chart = this.getChartType();
      var el = ReactDOM.findDOMNode(this);
      d3Chart.create(el, {
        width: '100%',
        height: '300px'
      }, this.getChartState());
    },

    componentDidUpdate: function() {
      var d3Chart = this.getChartType();
      var el = ReactDOM.findDOMNode(this);
      d3Chart.update(el, this.getChartState());
    },

    getChartState: function() {
      return {
        data: this.props.data,
        domain: this.props.domain
      };
    },

    componentWillUnmount: function() {
      var d3Chart = this.getChartType();
      var el = ReactDOM.findDOMNode(this);
      d3Chart.destroy(el);
    },

    render: function() {
      return (
        <div className="Chart"></div>
      );
    }
});

module.exports = Chart;