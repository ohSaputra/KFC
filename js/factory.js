angular.module('cart',[]).factory('Cart',function(){
	var cart = {
		tax_service_charge : '',
		delivery_charge : '',
		grandtotal : '',
		init: function(){
			if(localStorage.getItem("cart") == null)
				localStorage.setItem("cart",JSON.stringify([]));
		},
		clear: function(){
			localStorage.setItem("cart",JSON.stringify([]));
		},
		getAll: function(){
			return JSON.parse(localStorage.getItem("cart"));
		},
		getTotalItems: function(){
			var items = JSON.parse(localStorage.getItem("cart"));
			var total = 0;
			for(var i = 0; i < items.length;i++){
				total = total + parseInt(items[i].qty);
			}
			return total;
		},
		getTotalPrice: function(){
			var items = JSON.parse(localStorage.getItem("cart"));
			var total = 0;
			var attr_total = 0;
			for(var i = 0; i < items.length;i++){
				if(items[i].size_id == undefined) {
					total = total + (parseInt(items[i].qty) * parseInt(items[i].menu_price));
				} else if (items[i].size_id.detailed == 1) {
					total = total +  (parseInt(items[i].qty) * parseInt(items[i].size_attribute_id[items[i].size_index].price));
					// console.log(items[i].size_index);
				} else {
					total = total +  (parseInt(items[i].qty) * parseInt(items[i].size_id.size_price));
				}

				if(items[i].attr !== undefined) {
					for(var j = 0; j < items[i].attr.length ; j++){
						attr_total += (parseInt(items[i].qty) * parseInt(items[i].attr[j].attribute_price));
					}
				}
			}
			return (total+attr_total);
		},
		getTaxCharge:function(){
			return localStorage.getItem("tsc");
		},
		getDeliveryFee: function(){
			return localStorage.getItem("delfee");
		},
		addItem: function(item) {
			var items = JSON.parse(localStorage.getItem("cart"));
			items.push(item);
			localStorage.setItem("cart",JSON.stringify(items));
		},
		removeItem: function(index){
			var items = JSON.parse(localStorage.getItem("cart"));
			items.splice(index,1);
			localStorage.setItem("cart",JSON.stringify(items));
		},
		getItem: function(index){
			var item = JSON.parse(localStorage.getItem("cart"));
			return item[index];
		},
		updatePrice : function(tsc,delfee){
			tax_service_charge = tsc;
			delivery_charge = delfee;
			localStorage.setItem("delfee",delfee);
			localStorage.setItem("tsc",tsc);
		},
		updateTime : function(type,datetime) {
			localStorage.setItem("datetype",type);
			localStorage.setItem("datetime",datetime);
		},
		getDeliveryType:function(){
			return localStorage.getItem("datetype");
		},
		getDeliveryTime: function(){
			return localStorage.getItem("datetime");
		}
	}
	return cart;
});

angular.module('search',[]).factory('Search',function(){
	var cart = {
		items : '',
		latitude : '',
		longitude : '',
		type : '',
		init: function(){
			localStorage.setItem("search",JSON.stringify([]));
			localStorage.setItem("latitude","");
			localStorage.setItem("longitude","");
		},
		setArea: function(area) {
			localStorage.setItem("area",JSON.stringify(area));
		},
		getArea: function(){
			return JSON.parse(localStorage.getItem("area"));
		},
		clearArea: function(){
			localStorage.removeItem("area");
		},
		getAll: function(){
			return localStorage.getItem("search");
		},
		remove: function(){
			localStorage.setItem("search",JSON.stringify([]));
			localStorage.setItem("latitude","");
			localStorage.setItem("longitude","");
			localStorage.removeItem("service-type");
			localStorage.removeItem("delivery-type");
			localStorage.removeItem("delivery_address");
		},
		setType : function(type) {
			localStorage.setItem("service-type",type);
		},
		setDeliveryType : function(type) {
			localStorage.setItem("delivery-type",type);
		},
		setOutlet : function(id) {
			localStorage.setItem("outlet",id);
		},
		removeOutlet : function(id) {
			localStorage.removeItem("outlet");
		},
		addLoc: function(lat,lng) {
			localStorage.setItem("latitude",lat);
			localStorage.setItem("longitude",lng);
		},
		getLat : function() {
			return localStorage.getItem("latitude");
		},
		getLng : function(){
			return localStorage.getItem("longitude");
		},
		getType : function(){
			return localStorage.getItem("service-type");
		},
		getDeliveryType : function(){
			return localStorage.getItem("delivery-type");
		},
		getOutlet : function(){
			return localStorage.getItem("outlet");
		},
		getOutletDetails : function(){
			var area = JSON.parse(localStorage.getItem("area"));
			var id = localStorage.getItem("outlet");
			for(var i = 0;i< area.outlet.length;i++){
				if(area.outlet[i].id == id) {
					return area.outlet[i].name;
					break;
				}
			}
		},
		setDeliveryAddress : function(id) {
			localStorage.setItem("delivery-address",id);
		},
		getDeliveryAddress : function() {
			return localStorage.getItem("delivery-address");
		}
	}
	return cart;
});

angular.module('customer',[]).factory('Customer',function($rootScope,$http){
	var cart = {
		customer : '',
		address : '',
		init: function(customer){
			localStorage.setItem("customer",JSON.stringify(customer));
			localStorage.setItem("customer_address",JSON.stringify([]));
			$rootScope.$broadcast('state.login');
		},
		login: function(customer,address){
			localStorage.setItem("customer",JSON.stringify(customer));
			localStorage.setItem("customer_address",JSON.stringify(address));
			$rootScope.$broadcast('state.login');
		},
		getCustomerID : function(){
			customer = JSON.parse(localStorage.getItem("customer"));
			return customer.customer_id;
		},
		getCustomerEmail :function(){
			customer = JSON.parse(localStorage.getItem("customer"));
			return customer.customer_email;
		},
		setAddress: function(address) {
			localStorage.setItem("customer_address",JSON.stringify(address));
		},
		removeAddress: function(index){
			var items = JSON.parse(localStorage.getItem("customer_address"));
			items.splice(index,1);
			localStorage.setItem("customer_address",JSON.stringify(items));
		},
		getCustomer: function() {
			return JSON.parse(localStorage.getItem("customer"));
		},
		getAddress: function() {
			return JSON.parse(localStorage.getItem("customer_address"));
		},
		getAddressByIndex:function(index){
			var address = JSON.parse(localStorage.getItem("customer_address"));
			return address[index];
		},
		getAddressById:function(id){
			address = JSON.parse(localStorage.getItem("customer_address"));
			if(address == null) {
				return "";
			} else {
			var addr = "";
				for(var i = 0; i < address.length;i++){
					if(address[i].address_id == id) {
						addr = address[i];
						break;
					}
				}
				return addr;
			}
		},
		getDefaultAddress : function(){
			address = JSON.parse(localStorage.getItem("customer_address"));
			if(address == null) {
				return 0;
			} else {
				var addr = 0;
				for(var i = 0; i < address.length;i++){
					if(address[i].default_address == 1) {
						addr = address[i].address_id;
						break;
					}
				}
				return addr;
			}
		},
		refreshAddress: function() {
			customer = JSON.parse(localStorage.getItem("customer"));
			var urlLogin = url + "/refreshAddress.php?cust_id="+customer.customer_id+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				localStorage.setItem("customer_address",JSON.stringify(data));
			});
		},
		logout: function(){
			localStorage.removeItem("customer");
			localStorage.removeItem("customer_address");
			$rootScope.$broadcast('state.update');
		},
		isLogged : function(){
			if(localStorage.getItem("customer") == null)
				return false;
			else
				return true;
		}
	}
	return cart;
});
