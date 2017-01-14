var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var d3 = require('d3');
var Chart = require('./components/d3Chart');

var sampleData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4f8phwm', x: 11, y: 45, z: 9},
  {id: '5fbmzmtw', x: 7, y: 41, z: 8},
  {id: '5fbmzmtq', x: 5, y: 23, z: 9},
  {id: '5fbmzmww', x: 3, y: 21, z: 5},
  {id: '5fbmzmer', x: 6, y: 12, z: 2},
  {id: 's4f8pqwm', x: 1, y: 33, z: 3}
];

var Puke = React.createClass({
	render: function () {
		// console.log("PukeData", this.props.data)
		return <pre>{JSON.stringify(this.props.data, " ", 1)}</pre>
	}
})

var D3Chart = React.createClass({
	getInitialState: function() {
		return {
			rawData:[],
		    data: sampleData,
    		domain: {x: [0, 30], y: [0, 10] }
		}
	},
	componentWillMount: function () {
		this.loadRawData()
	},
	domainCalculator: function(data, xvar, yvar){
    // console.log("Inside domain calculator",data)
    	var domain = {}
    	if(typeof(data[1].xvar)=='string'){
      // console.log()
      // console.log('string')
      		domain.x = _.keys(_.groupBy(data, function(d){return d.xvar;}))
    	} else  {
      		var numbers = _.keys(_.groupBy(data, function(d){return d.xvar;})).map(Number)
      		domain.x = [0, d3.max(numbers)]
    	};

    	if(typeof(data[1].yvar)=='string'){
      // console.log()
      // console.log('string')
     		 domain.y = _.keys(_.groupBy(data, function(d){return d.yvar;}))
    	} else  {
      		var numbers = _.keys(_.groupBy(data, function(d){return d.yvar;})).map(Number)
      		domain.y = [0, d3.max(numbers)]
    	}; 
    // var numbers = _.keys(_.groupBy(data, function(d){return d[yvar];})).map(Number);
    
    return  domain
  	},
	loadRawData: function() {
		d3.csv(this.props.url)
			.row( function(d){
            if (!d[this.props.xvar]) {
              return null;
            }       			
			return {
				xvar: d[this.props.xvar],
              	yvar: Number(d[this.props.yvar])
				}
			}.bind(this))
			.get(function(error,rows){
				if(error){
					console.error("Error",error);
				} else {
					// console.log("Rows",rows);
					var newDomain = this.domainCalculator(rows, this.props.xvar, this.props.yvar)
					// console.log("Hi",rows)
              		this.setState({
                		rawData:rows, 
                		domain: newDomain
              		});
				}
			}.bind(this))
			// console.log("Mounted")
	}, 
	componentDidMount: function () {
		// console.log("Data",this.state.rawData)
	},
	render: function() {
		return(
				<div className="row">
					<div className="row">
						<h1>Welcome to the d3 app!</h1>
					</div>
					<p>In this app, we try to demonstrate the use of d3 based charts in React. We will be creating several components, and placing them in here.</p>		
					<div className="col-md-12">
						 <Chart data={this.state.rawData} domain={this.state.domain} />
						{/*<svg>
							<D3Bar data={this.state.rawData}>
							</D3Bar> 

						</svg>*/}
						<Puke data={this.state.rawData}/>
					</div>
				</div>
			);
	}
}) 

ReactDOM.render(
	<D3Chart url="data/dummy.csv" xvar="var" yvar="value3" />,
	document.querySelectorAll('.h1bgraph')[0]
)