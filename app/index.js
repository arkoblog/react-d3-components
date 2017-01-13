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
	loadRawData: function() {
		d3.csv(this.props.url)
			.row( function(d){
		  	if (!d['var']) {
		  		return null;
		  	}				
			return {
					variable: d.var,
					amount: Number(d.value)	
				}
			}.bind(this))
			.get(function(error,rows){
				if(error){
					console.error("Error",error);
				} else {
					// console.log(rows)
					this.setState({rawData:rows});
					// console.log("RawDate",this.state.rawData,"rows",rows)
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
	<D3Chart url="data/dummy.csv" />,
	document.querySelectorAll('.h1bgraph')[0]
)