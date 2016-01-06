var Item = React.createClass({
  //this sets the state of each item as not in edit mode on creation
  getInitialState: function(){
    return {edit: false}
  },

  // This deletes an item then refreshes the store
  deleteItem: function() {
    var self = this;
    var id = this.props.id
    $.ajax({
      url: '/items/' + id,
      type: 'DELETE',
      success: function() {
        self.props.refreshStore()
      }
    })
  },

  //This removes one from the quantity
  purchase: function() {
    var id = this.props.id;
    var newQuantity = this.props.quantity -= 1;
    var self = this;
    $.ajax({
      url: '/items/' + id,
      type: 'PUT',
      data: {item: {quantity: newQuantity}},
      success: function(data){
        self.props.refreshStore()
      }
    })
  },

  // this toggles a state so that we can work on it
  toggleEdit: function(){
    this.setState({edit: !this.state.edit})
  },

  // This closes the edit form without making changes
  cancelEdit: function(){
    this.setState({edit: false})
  },

  // this actually updates the item in the db
  updateItem: function(e){
    e.preventDefault()
    var id = this.props.id
    var self = this;
    var name = ReactDOM.findDOMNode(this.refs.itemName).value
    var description = ReactDOM.findDOMNode(this.refs.itemDescription).value
    var price = ReactDOM.findDOMNode(this.refs.itemPrice).value
    var quantity = ReactDOM.findDOMNode(this.refs.itemQuantity).value
    $.ajax({
      url: '/items/' + id,
      type: 'PUT',
      data: {item: {name: name, description: description, price: price, quantity: quantity}},
      success: function(data){
        self.setState({edit: false});
        self.props.refreshStore()
      }
    })
  },

  // This is the form that is rendered on each edit
  edit: function() {
    return(

      <div className='card hoverable blue lighten-5'>
        <div className='card-content row'>
          <form onSubmit={this.updateItem}>
              <div className='col s12'>
                <div className=' '>
                  <label>Item Name</label>
                  <input autoFocus='true' type='text' ref='itemName' defaultValue={this.props.name} />
                </div>
                <div className=''>
                  <label>Item Description</label>
                  <input type='text' ref='itemDescription' defaultValue={this.props.description} />
                </div>
                <div className=''>
                  <label>Price</label>
                  <input type='number' ref='itemPrice' defaultValue={this.props.price} />
                </div>
                <div className=''>
                  <label>Quantity</label>
                  <input  type='number' ref='itemQuantity' defaultValue={this.props.quantity} />
                </div>
                <div>
                  <button className='btn waves-effect' type='submit'>Submit Edit</button>
                  <button className='btn waves-effect' onClick={this.cancelEdit}>Cancel</button>
                </div>
              </div>
          </form>
        </div>
      </div>);
  },

  // This renders an indvidual items html
  item: function() {
    var item = this.props
    var id = 'Item-' + item.id
    return(
      <div className='card hoverable blue lighten-5'>
        <div className='card-content row'>
          <div className='col s8'>
            <span className='card-title '>{item.name}</span>
            <p>{item.description}</p>
          </div>
          <div className='col s2'>
            <p>Price: {item.price}</p>
            <p>Quantity {item.quantity}</p>
          </div>
          <div className='col s1'>
            <button className='btn' onClick={this.deleteItem}>Delete</button>
            <button className='btn' onClick={this.toggleEdit}>Edit</button>
            <button className='btn' onClick={this.purchase}>Purchase</button>
          </div>
        </div>
      </div>);
  },

  // This is so we can render the edit form or the normal format
  render: function() {
    if(this.state.edit) {
      return this.edit()
    } else {
      return this.item()
    }
  }

});
