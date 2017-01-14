var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var d3 = require('d3');
var Chart = require('./components/d3Chart');

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
					var newDomain = this.domainCalculator(rows, this.props.xvar, this.props.yvar)
              		this.setState({
                		rawData:rows, 
                		domain: newDomain
              		});
				}
			}.bind(this))
	}, 
	componentDidMount: function () {
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