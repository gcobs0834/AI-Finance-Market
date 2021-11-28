module.exports = function Cart(oldCart) { //cart constructor
    this.items = oldCart.items || {};
    if(oldCart.totalQty == null){
        this.totalQty=parseInt(0);
    }
    this.totalQty = oldCart.totalQty || parseInt(0);
    if(this.totalQty<=0){
        this.totalQty=parseInt(0);
  }
    this.totalPrice = oldCart.totalPrice || parseInt(0);

    this.add = function(item, id, count) {
        var storedItem = this.items[id]; // DB product ID
        if (!storedItem) { //if there's no item, then add a new one
            storedItem = this.items[id] = {item: item, qty: parseInt(0), productPrice: parseInt(0)};
        }
        storedItem.qty+=parseInt(count);
        storedItem.productPrice = storedItem.item.productPrice * storedItem.qty;//group of item
        this.totalQty+=parseInt(storedItem.qty);
        this.totalPrice += parseInt(storedItem.productPrice);
    };

    this.addOne = function(item, id) {
      var storedItem = this.items[id]; // DB product ID
      if (!storedItem) { //if there's no item, then add a new one
          storedItem = this.items[id] = {item: item, qty: 0, productPrice: 0};
      }
      storedItem.qty++;
      storedItem.productPrice = storedItem.item.productPrice * storedItem.qty; //group of item
      this.totalQty++;
      this.totalPrice += storedItem.item.productPrice;
    };


    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].productPrice -= this.items[id].item.productPrice;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.productPrice;

        if (this.items[id].qty <= parseInt(0)) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].productPrice;
        delete this.items[id];
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};
