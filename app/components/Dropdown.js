var React = require('react');

var Dropdown = React.createClass({
	getInitialState: function() {
		return{
			value:this.props.selectedYVal
		}
	},
    handleChange: function(event){
    	var selectedHeader = (this.props.headers[event.target.value]);
        this.setState({value: selectedHeader});
    },
    handleSubmit: function (event) {
    		event.preventDefault();
            this.props.updateDataFunction(this.state.value);	
    },
	render: function() {
		return (
			<div className="row">
		      <form onSubmit={this.handleSubmit}>
		        <hr/>  
		        <label>	Please select the column you wish to populate:
		        	<select onChange={this.handleChange}>
		           		{this.props.headers.map(function(listValue, i){
		            			return <option  selected={listValue == this.props.selectedYVal} value={i} key={i} >{listValue}</option>;
		          		}.bind(this))}
					</select> 
				</label> <br/>
		        <input type="submit" value="Submit" /> 
		      </form>
			</div>
		)
	}
})

module.exports = Dropdown;