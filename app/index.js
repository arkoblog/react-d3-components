var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var d3 = require('d3');

var H1BGraph = React.createClass({
	render: function() {
		return(
				<div className="row">
					<div className="row">
						<h1>Welcome to the d3 app!</h1>
					</div>		
					<div className="col-md-12">
						<svg width="700" height="500">

						</svg>
					</div>
				</div>
			);
	}
}) 

ReactDOM.render(
	<H1BGraph url="data/h1bs.csv" />,
	document.querySelectorAll('.h1bgraph')[0]
)