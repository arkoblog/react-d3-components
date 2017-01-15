var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var d3 = require('d3');
var Chart = require('./components/d3Chart');
var Dropdown = require('./components/Dropdown');

var sampleData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4f8phwm', x: 11, y: 45, z: 9},
];

var sampleDomain = {x: [0, 30], y: [0, 100]}

var Puke = React.createClass({
	render: function () {
		// console.log("PukeData", this.props.data)
		return <pre>{JSON.stringify(this.props.data, " ", 1)}</pre>
	}
})

var App = React.createClass({
	updateData: function(selectedHeader) {
			this.setState({selectedColumn: selectedHeader})
			this.loadRawData(this.props.xvar, selectedHeader)
	},
	domainCalculator: function(data, xvar, yvar){
    	var domain = {}
    	if(typeof(data[1].xvar)=='string'){
      		domain.x = _.keys(_.groupBy(data, function(d){return d.xvar;}))
    	} else  {
      		var numbers = _.keys(_.groupBy(data, function(d){return d.xvar;})).map(Number)
      		domain.x = [0, d3.max(numbers)]
    	};

    	if(typeof(data[1].yvar)=='string'){
     		 domain.y = _.keys(_.groupBy(data, function(d){return d.yvar;}))
    	} else  {
      		var numbers = _.keys(_.groupBy(data, function(d){return d.yvar;})).map(Number)
      		domain.y = [0, d3.max(numbers)]
    	}; 
        return  domain
  	},



  	getColumnHeaders: function (){
  			d3.csv(this.props.url, function(error,data) {
  				var headerNames = d3.keys(data[0]);
				this.setState({columnHeaders: headerNames})
  			}.bind(this))
  	},

  	aggregateData: function(data) {
  		console.log("Raw Data",data);
		var aggregated = d3.nest()
		  .key(function(d) { return d.xvar; })
		  .rollup(function(v) { return {
		    count: v.length,
		    total: d3.sum(v, function(d) { return d.yvar; }),
		    avg: d3.mean(v, function(d) {return d.yvar; }),
		    min: d3.min(v, function(d) {return d.yvar; }),
		    max: d3.max(v, function(d) {return d.yvar; })
		  }; })
		  .entries(data);
  		// console.log(aggregated);
  		meanData = [];
  		countData = [];
  		sumData = []
  		minData = []
  		maxData =[]



  		aggregated.map(function(item){
  			meanData.push({xvar:item.key, yvar: item.values.avg})
  		})

  		aggregated.map(function(item){
  			sumData.push({xvar:item.key, yvar: item.values.total})
  		})

  		aggregated.map(function(item){
  			countData.push({xvar:item.key, yvar: item.values.count})
  		})

  		aggregated.map(function(item){
  			minData.push({xvar:item.key, yvar: item.values.min})
  		})

  		aggregated.map(function(item){
  			maxData.push({xvar:item.key, yvar: item.values.max})
  		})

  		console.log("count",countData);
  		console.log("sum",sumData);
  		console.log("mean",meanData);
  		console.log("min",minData);
  		console.log("max",maxData);

  		return data;

  	},
	
	loadRawData: function(var1, var2) {
		d3.csv(this.props.url)
			.row( function(d){
			if (!d[var1]) {
              return null;
            }       			
			return {
				xvar: d[var1],
              	yvar: Number(d[var2])
				}
			}.bind(this))
			.get(function(error,rows){
				if(error){
					console.error("Error",error);
				} else {
					var agg = this.aggregateData(rows);
					var newDomain = this.domainCalculator(rows, var1, var2)
					this.setState({
                		rawData:rows, 
                		domain: newDomain
              		});
				}
			}.bind(this))
	}, 
	
	getInitialState: function() {
		return {
			rawData:[],
	   		domain: {x: [0, 30], y: [0, 10] },
	   		columnHeaders: [],
	   		selectedColumn: ''
		}
	},
	
	componentWillMount: function () {
		this.getColumnHeaders();
		this.loadRawData(this.props.xvar, this.props.yvar)
	},
	componentDidMount: function () {
	},
	render: function() {
		return(
				<div className="row">
					<div className="row">
						<h1>Welcome to the d3 app!</h1>
					</div>
					<div className="row">
						<p>In this app, we try to demonstrate the use of d3 based charts in React. We will be creating several components, and placing them in here.</p>		
						<ul className="nav nav-tabs">
						  <li className="active"><a data-toggle="tab" href="#barchart">Bar Chart</a></li>
						  <li><a data-toggle="tab" href="#scatterplot">ScatterPlot</a></li>
						  <li><a data-toggle="tab" href="#aggregator">Aggregated Values</a></li>
						</ul>
						<div className="col-md-12 tab-content">
							<div id = "barchart" className="tab-pane fade in active">
								<Dropdown headers = {this.state.columnHeaders} updateDataFunction={this.updateData} selectedYVal={this.props.yvar}/>
								<Chart data={this.state.rawData} domain={this.state.domain} type="Bar"/>
								<Puke data={this.state.rawData}/>
							</div>
							<div id="scatterplot" className="tab-pane fade">
								 <h1>This is a scatterplot</h1>
								 <p>It doesn't work very well!</p>
								 <Chart data={sampleData} domain={sampleDomain} type="Scatter"/>
								<Puke data={sampleData}/>
						
							</div>
							<div id="aggregator" className="tab-pane fade">
								 <h1>This is an aggregator</h1>
								 <p>It doesn't work very well!</p>
								 <Chart data={sampleData} domain={sampleDomain} type="Bar"/>
								<Puke data={sampleData}/>
						
							</div>
							
						</div>
					</div>
				</div>
			);
	}
}) 

ReactDOM.render(
	<App url="data/dummy2.csv" xvar="var" yvar="value3"/>,
	document.querySelectorAll('.app')[0]
)