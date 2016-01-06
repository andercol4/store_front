var Store = React.createClass({
  // this sets up the basic state
  getInitialState: function() {
    return {items: []}
  },
  // this gets called at the beginning to get it setup it just passes it to another method
  componentDidMount: function() {
    this.refreshStore()
  },
  // this gets called anytime anything gets changed. or on initial set up
  refreshStore: function() {
    var self = this;
    $.ajax({
      url: '/items',
      type: 'GET',
      success: function(data) {
        self.setState({items: data})
      }
    })
  },

  // this actually makes the items class for use
  displayItems: function() {
    var items = [];
    for(var i=0; i < this.state.items.length; i++){
      var item = this.state.items[i]
      var key = "Item-" + item.id
      items.push(<Item refreshStore={this.refreshStore} key={key} id={item.id} name={item.name} description={item.description} price={item.price} quantity={item.quantity} />)
    };
    return items;
  },

  // This toggles the newForm state so it can appear and dissapear
  showNewForm: function() {
    this.setState({newForm: !this.state.newForm})
  },

  // This detects if newForm is true and if it is it opens the form
  newItemForm: function() {
    if(this.state.newForm){
      return(
        <div>
          <form onSubmit={this.createItem}>
            <div className='row'>
              <div className='col s12'>
                <div className='input-field '>
                  <input autoFocus='true' type='text' ref='itemName' />
                  <label>Item Name</label>
                </div>
                <div className='input-field '>
                  <input type='text' ref='itemDescription' />
                  <label>Item Description</label>
                </div>
                <div className='input-field'>
                  <input type='number' ref='itemPrice' />
                  <label>Price</label>
                </div>
                <div className='input-field'>
                  <input  type='number' ref='itemQuantity' />
                  <label>Quantity</label>
                </div>
                <div>
                  <button className='btn waves-effect' type='submit'>Save</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )
    }
  },

  //this function does a POST request
  createItem: function(e){
    e.preventDefault()
    var self = this;
    var name = ReactDOM.findDOMNode(this.refs.itemName).value
    var description = ReactDOM.findDOMNode(this.refs.itemDescription).value
    var price = ReactDOM.findDOMNode(this.refs.itemPrice).value
    var quantity = ReactDOM.findDOMNode(this.refs.itemQuantity).value
    $.ajax({
      url: '/items',
      type: 'POST',
      data: {item: {name: name, description: description, price: price, quantity: quantity}},
      success: function(data){
        items = self.state.items
        items.push(data)
        self.setState({items: items, newForm: false});
      }
    })
  },

  // this is the whole page render
  render: function() {
    return(
      <div>
        <div>
        <button className='waves-effect waves-light btn' onClick={this.showNewForm}>New Item</button>
        {this.newItemForm()}
        <h1>Store</h1>
        <div className='row'>
          {this.displayItems()}
        </div>
        </div>
      </div>
    )
  }
});
