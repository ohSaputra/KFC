var url = "http://128.199.67.183:8082/ph";
var company_id = 2;
var app = angular.module('indexApp', [
  "sdfilters",
  "cart",
  "search",
  "ionic",
  "customer",
  "ui.bootstrap.datetimepicker"
]);

app.config(['$httpProvider', function($httpProvider) {
          $httpProvider.defaults.useXDomain = true;
          delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
]);

app.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider.state('login', {
          url : '/login',
          templateUrl : 'login.html',
          controller : 'loginCtrl'
  }).state('midlogin', {  url : '/login-mid/:outlet_id/:brand_id',
              templateUrl : 'mid-login.html',
              controller : 'midLoginCtrl'
  }).state('home', {  url : '/',
            cache : false,
            templateUrl : 'home.html',
            controller : 'homeCtrl'
  }).state('history',{
            url : '/history/:id',
            templateUrl : 'history.html',
            controller : 'historyCtrl'
  }).state('my-account', {
            url : '/my-account',
            templateUrl : 'account.html',
            controller : 'accountCtrl'
  }).state('my-address', {
            url : '/my-address',
            templateUrl : 'address.html',
            controller : 'addressCtrl'
  }).state('new-address', {
            url : '/new-address',
            templateUrl : 'address-new.html',
            controller : 'newAddressCtrl'
  }).state('location-search', {
            url : '/location-search/',
            templateUrl : 'map-search.html',
            controller : 'locationCtrl'
  }).state('search', {
            url : '/search',
            templateUrl : 'search.html',
            controller : 'searchCtrl'
  }).state('restaurant', {
            url : '/restaurant/',
            templateUrl : 'restaurant.html',
            controller : 'restoCtrl'
  }).state('order', {
            url : '/order/:outlet_id/:brand_id/:as',
            templateUrl : 'order.html',
            controller : 'orderCtrl'
  }).state('cart', {
            url : '/cart/:outlet_id/:brand_id',
            templateUrl : 'cart.html',
            controller : 'cartCtrl'
  }).state('checkout', {
            url : '/checkout/:outlet_id/:brand_id',
            templateUrl : 'checkout.html',
            controller : 'checkoutCtrl'
  }).state('confirmation', {
            url : '/confirmation/:order_id',
            templateUrl : 'confirmation.html',
            controller : 'confirmationCtrl'
  }).state('promotion',{
            url : '/promotion/',
            templateUrl : 'promotion.html',
            cache : false
  }).state('promotion2',{
            url : '/promotion2/:page',
            templateUrl : 'promotion2.html',
            controller : 'promotionCtrl'
  }).state('storelist',{
            url : '/storelist/',
            templateUrl : 'storelist.html',
            controller : 'storeListCtrl'
  }).state('menu',{
            url : '/menu/',
            templateUrl : 'menu.html',
            controller : 'menuCtrl'
  }).state('menu2',{
            url : '/menu-details/:category',
            templateUrl : 'menu2.html',
            controller : 'menuCtrl2'
  }).state('feedback',{
            url : '/feedback/',
            templateUrl : 'feedback.html',
            controller : 'feedbackCtrl',
            cache : false
  }).state('pages', {
            url : '/pages/:page',
            templateUrl : 'faq.html'
  }).state('how-to-order',{
            url : '/how-to-order',
            templateUrl : 'howtoorder.html'
  }).state('about-us',{
            url : '/about-us',
            templateUrl : 'about.html',
            controller : 'aboutCtrl'
  }).state('faq', {
            url : '/faq/',
            templateUrl : 'faq.html'
  }).state('faq2',{
            url : '/faq2/:page',
            templateUrl : 'faq2.html',
            controller : 'faqCtrl'
  }).state('tc', {
            url : '/tc/',
            templateUrl : 'tc.html'
  }).state('tc2',{
            url : '/tc2/:page',
            templateUrl : 'tc2.html',
            controller : 'tcCtrl'
  });
  $urlRouterProvider.otherwise('/');
});

app.config(function($urlRouterProvider,$ionicConfigProvider){
    $urlRouterProvider.when('', '/');
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText('');
});

app.run(function($rootScope,$ionicNavBarDelegate,$ionicSideMenuDelegate,$ionicPopover,$location,Customer,Search,Cart,$http,$ionicPlatform){
  $ionicPlatform.ready(function() {
     Search.remove();
     Search.clearArea();
     Cart.clear();
     var logged = Customer.isLogged();
     if(logged == true) {
       Customer.refreshAddress();
     }
     $http.get("http://128.199.235.202/area/fb.json").success(function(data){
        Search.setArea(data.fatburger);
     });
  });

  $rootScope.reloadData =function(){
    $http.get("http://128.199.235.202/area/fb.json").success(function(data){
       Search.setArea(data.fatburger);
    });
  };
  $rootScope.toHome = function() {
    $location.path('/');
  };

  $rootScope.toCart = function() {
    if(Cart.getTotalItems() > 0) {
      var outlet_id = Search.getOutlet();
      $location.path('/cart/'+outlet_id+'/1');
    } else {
      $location.path('/');
    }
  };

  $rootScope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $rootScope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $rootScope.logout = function() {
    Customer.logout();
  };
});

app.controller('panelCtrl',function($scope,$location,Customer){
  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
  });
  $scope.$on('state.login', function () {
      $scope.logged_in = true;
  });
});

app.controller('addressCtrl',function($scope,$http,$location,Customer,$ionicSideMenuDelegate,Search){
  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
      $scope.newAddress = true;
      $scope.defaultAddress;
    });
  $scope.addresses = Customer.getAddress();

  $scope.deleteItem = function(index) {
    Customer.removeAddress(index);
    $scope.addresses = Customer.getAddress();
  };
});

app.controller('historyCtrl',function($scope,$http,$state,$stateParams,$ionicSideMenuDelegate,Customer){
    $scope.logged_in = Customer.isLogged();
    $scope.$on('state.update', function () {
       $scope.logged_in = false;
       $scope.newAddress = true;
    });
    if($scope.logged_in == true)
    {
       $scope.order_id = $stateParams.id;
       $scope.customer_id = Customer.getCustomerID();
       $scope.orderhistory = {};
       $scope.details = {};
       if($scope.order_id == '') {
           var urlLogin = url + "/orderHistory.php?customer_id="+$scope.customer_id+"&callback=JSON_CALLBACK";
           $http.jsonp(urlLogin).success(function(data) {
           $scope.orderhistory = data.history;
         });
       } else {
        var urlLogin = url + "/orderHistoryDetail.php?customer_id="+$scope.customer_id+"&order_id="+$scope.order_id+"&callback=JSON_CALLBACK";
        $http.jsonp(urlLogin).success(function(data) {
          $scope.details = data.history_detail;
          console.log(data.history_detail);
        });
       }
    } else {
      $state.go('home');
    }

    $scope.toDetail = function(order_id){
      $state.go('history', { 'id' : order_id });
    };
});

app.controller('accountCtrl',function($scope,$http,Customer,$state){
  $scope.customer = Customer.getCustomer();
});

app.controller('loginCtrl',function($scope,$http,Customer,Search,$state){
  $scope.errorLogin = 0;
  $scope.errorSignup = 0;
  $scope.logged_in = Customer.isLogged();
  if($scope.logged_in == true) {
    $state.go('home');
  }
  $scope.$on('state.login', function () {
      $scope.logged_in = true;
  });
  $scope.doLogin = function (user) {
      var urlLogin = url + "/login.php?company_id="+company_id+"&user="+user.email+":"+user.password+"&callback=JSON_CALLBACK";
      $http.jsonp(urlLogin).success(function(data) {
        if(data.login == 0) {
          $scope.errorLogin = 1;
        }
        else {
          var address = data.address;
          delete data.login;
          delete data.address;

          Customer.login(data,address);
          $scope.errorLogin = 0;
          $state.go('home');
        }
      });
  };
  $scope.doSignUp = function (user) {
    user.company_id = company_id;
    $http.defaults.useXDomain = true;
    $http({
        url: url + "/signup.php",
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
        data: user
    }).then(function(response) {
        if(response.data.customer_id > 0) {
          $scope.errorSignup = 0;
          Customer.init(response.data);
          $state.go('home');
        } else {
          $scope.errorSignup = 1;
        }
    });
  };
});

app.controller('midLoginCtrl',function($scope,$stateParams,$http,$location,Customer,Search){
  $scope.errorLogin = 0;
  $scope.errorSignup = 0;
  $scope.outlet_id = $stateParams.outlet_id;
  $scope.brand_id = $stateParams.brand_id;
  $scope.doLogin = function (user) {
      var urlLogin = url + "/login.php?company_id="+company_id+"&user="+user.email+":"+user.password+"&callback=JSON_CALLBACK";
      $http.jsonp(urlLogin).success(function(data) {
        if(data.login == 0) {
          $scope.errorLogin = 1;
        }
        else {
          var address = data.address;
          delete data.login;
          delete data.address;

          Customer.init(data);
          Customer.setAddress(address);
          $scope.errorLogin = 0;
          $location.path('/checkout/'+$scope.outlet_id+'/'+$scope.brand_id);
        }
      });
    };
    $scope.doSignUp = function (user) {
      user.company_id = company_id;
      $http.defaults.useXDomain = true;
      $http({
          url: url + "/signup.php",
          method: "POST",
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
          data: user
      }).then(function(response) {
          if(response.data.customer_id > 0) {
            $scope.errorSignup = 0;
            Customer.init(response.data);
            $location.path('/checkout/'+$scope.outlet_id+'/'+$scope.brand_id);
          } else {
            $scope.errorSignup = 1;
          }
      });
    };
});

app.controller('homeCtrl',function($scope,$location,$ionicActionSheet,$ionicSideMenuDelegate,Cart,$ionicPopup,$ionicLoading,$http,$ionicModal,Customer,Search,$window){
  $scope.logged_in = Customer.isLogged();
  $scope.areaJson = Search.getArea();
  $scope.searchType = Search.getType();
  $scope.data  = {};
  Search.init();
  $scope.isResume = Cart.getTotalItems();

  $scope.$on('state.update', function () {
      $scope.logged_in = false;
  });
  $scope.$on('state.login', function () {
      $scope.logged_in = true;
  });
  if($scope.logged_in == true){
    $scope.customer = Customer.getCustomer();
  }

  $scope.startNew = function() {
    Cart.clear();
    $scope.isResume = 0;
  };
  $scope.show = function(template) {
      $ionicLoading.show({
        template: template
      });
  };
  $scope.hide = function(){
      $ionicLoading.hide();
  };

  $scope.showSheet = function(){
    var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Delivery' }
       ],
       titleText: 'Choose Your Service',
       cancelText: 'Cancel',
       cancel: function() {

       },
       buttonClicked: function(index) {
        // if(index==0) { //PICKUP
        //   Search.setType(1);
        //   $scope.data.selected = 1;
        //   $scope.openModal(1);
        // }
        // else { //DELIVERY
        if (index==0) {
          Search.setType(2);
          $scope.data.selected = Customer.getDefaultAddress();
          $scope.addresses = Customer.getAddress();
          $scope.data.new_type = 0;
          $scope.openModal(2);
        }
        return true;
       }
     });
  };

  $scope.showAlert = function() {
     var confirmPopup = $ionicPopup.alert({
       title: 'Delivery Service',
       template: 'Sorry, we don\'t deliver to your location<br/>If you believe this is a mistake, please choose the manual input.'
     });
  };

  $ionicModal.fromTemplateUrl('chooseAddress-modal.html', {
      id: '2',
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal2 = modal;
  });

  $ionicModal.fromTemplateUrl('pickup-modal.html', {
      id: '1',
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal1 = modal;
  });

  $scope.openModal = function(index) {
    if(index == 1)
      $scope.modal1.show();
    else
      $scope.modal2.show();
  };
  $scope.closeModal = function(index) {
      $scope.modal1.hide();
      $scope.modal2.hide();
  };
  $scope.applyPickup = function(){
    Search.setOutlet($scope.data.selected);
    $scope.modal1.hide();
    $location.path("/restaurant/");
  };
  $scope.applyDelivery = function() {
    if($scope.data.selected > 0) {
      $scope.show('Searching for Restaurants ...');
      var addr = Customer.getAddressById($scope.data.selected);
      Search.setDeliveryAddress(addr.address_id);
      $scope.latitude = addr.latitude;
      $scope.longitude = addr.longitude;
      var areaJson = Search.getArea();
      angular.forEach(areaJson.outlet, function(value,key){
          var pathArray = google.maps.geometry.encoding.decodePath(value.area);
          var pathPoly = new google.maps.Polygon({
              path: pathArray
          });
          if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng($scope.latitude,$scope.longitude),pathPoly)) {
                Search.setOutlet(value.id);
                $scope.hide();
                $location.path("/restaurant/");
          }
      });
    } else {
      Search.setDeliveryAddress($scope.data.selected);
      if($scope.data.new_type == 0) {
        $scope.show('Searching for Restaurants...');
        var found;
        var areaJson = Search.getArea();
        var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 90000 };
        navigator.geolocation.getCurrentPosition(function(position) {
              $scope.latitude = position.coords.latitude;
              $scope.longitude = position.coords.longitude;
              $scope.accuracy = position.coords.accuracy;
              $scope.$apply();
              var latlng = new google.maps.LatLng($scope.latitude,$scope.longitude);
              var i = 0;
              Search.addLoc($scope.latitude,$scope.longitude);
              for(i = 0; i < areaJson.outlet.length; i++){
                  var pathArray = google.maps.geometry.encoding.decodePath(areaJson.outlet[i].area);
                  var pathPoly = new google.maps.Polygon({
                      path: pathArray
                  });
                  if(google.maps.geometry.poly.containsLocation(latlng,pathPoly)) {
                      Search.setOutlet(areaJson.outlet[i].id);
                      Search.setDeliveryType(0);
                      found = true;
                      break;
                  }
                  if(i == (areaJson.outlet.length-1)) {
                      found = false;
                  }
              };
              $scope.hide();
              if(found == true) {
                $location.path("/restaurant/"); }
              if(found == false) {
                $scope.showAlert();
              }
          },function() {
              $scope.hide();
              $scope.showAlert();
          },options);
      } else {
          Search.setDeliveryType(1);
          $scope.modal1.show();
      }
    }
    $scope.modal2.hide();
  };
  $scope.$on('$destroy', function() {
      $scope.modal1.remove();
      $scope.modal2.remove();
  });
});

app.controller('restoCtrl',function($scope,$http,Search,Customer){
  $scope.logged_in = Customer.isLogged();
  $scope.serviceType = Search.getType();
  $scope.outlet_id = Search.getOutlet();
  $scope.details = Search.getOutletDetails()
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
  });
  $scope.$on('state.login', function () {
      $scope.logged_in = true;
  });
  console.log($scope.outlet_id);
  $scope.brand_id = 0;
  var urlLogin = url + "/outletInfo.php?outlet_id="+$scope.outlet_id+"&callback=JSON_CALLBACK";
  $http.jsonp(urlLogin).success(function(data) {
    $scope.outletInfo = data.outlet;
    $scope.brand_id = $scope.outletInfo.brand_id;
    urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.outletInfo.brand_id+"&callback=JSON_CALLBACK";
    $http.jsonp(urlLogin).success(function(data){
        $scope.menuCategories = data.category;
    });
  });
}).directive('restaurant',function() {
  return {
    restrict : 'E',
    templateUrl: 'restaurant-template.html'
  };
});

app.controller('orderCtrl',function($scope,$stateParams,$ionicModal,$http,Cart,$ionicLoading,$location,Customer){
  $scope.outlet_id = $stateParams.outlet_id;
  $scope.brand_id = $stateParams.brand_id;
  $scope.tab = $stateParams.as;
  $scope.menuz = [];
  $scope.menu = {};
  var arrayLoaded = [];

  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
  });
  $scope.$on('state.login', function () {
        $scope.logged_in = true;
  });

  $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
  };
  $scope.hide = function(){
      $ionicLoading.hide();
  };

  var urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
  $http.jsonp(urlLogin).success(function(data){
    $scope.menuCategories = data.category;
    if($scope.tab !== "") {
      urlLogin = url + "/outletMenu.php?category_id="+$scope.tab+"&callback=JSON_CALLBACK";
      $http.jsonp(urlLogin).success(function(data){
        $scope.menuz[$scope.tab] =data.menu;
        arrayLoaded.push($scope.tab);
        $scope.menus = $scope.menuz[$scope.tab];
      });
    }
  });
  $scope.loadMenu = function(a) {
    $scope.tab = a;
    if(arrayLoaded.indexOf(a) == -1 ) {
      urlLogin = url + "/outletMenu.php?category_id="+a+"&callback=JSON_CALLBACK";
      $http.jsonp(urlLogin).success(function(data){
        $scope.show();
        $scope.menuz[a] =data.menu;
        arrayLoaded.push(a);
        $scope.menus = $scope.menuz[a];
        $scope.hide();
      });
    } else {
      $scope.menus = $scope.menuz[a];
    }
  }

  $scope.openModal = function (data){
    $scope.menu_id              = data;
    $scope.indx                 = 0;
    $scope.size_attribute       = {};
    $scope.size_attribute_index = {};
    $scope.menu                 = {};
    var urlLogin = url + "/menuInformation.php?menu_id="+$scope.menu_id+"&callback=JSON_CALLBACK";
    $http.jsonp(urlLogin).success(function(data){
      $scope.menu = data.menu;
      $scope.menu.qty = 1;
      if(data.menu.size.length>0) {
        $scope.menu.size_id = $scope.menu.size[0];
        $scope.menu.size_attribute_id = {};
        for(var i = 0;i < data.menu.size.length;i++) {

          if(data.menu.size[i].detailed == 1) {
            $scope.size_attribute[i] = data.menu.size[i].size_id;
            $scope.menu.size_attribute_id[i] = data.menu.size[i].size_attr[0];
            $scope.size_attribute_index[i] = i;
            console.log($scope.menu);
          }

        }
        console.log($scope.size_attribute);
      }
      $scope.modal.show();
    });

    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.addToCart = function (inputs) {
      delete inputs['size'];
      delete inputs['menu_description'];
      var temp = [];
      angular.forEach(inputs.attr,function(value,key){
        if(value.selected == true) {
          temp.push(value);
        }
      });
      if(temp.length == 0)
        delete inputs['attr'];
      else
        inputs.attr = temp;
      if(inputs.size_id) {
        if(inputs.size_id.detailed == 1)
          delete inputs.size_id['size_attr'];
      }
      Cart.addItem(inputs);
      $scope.modal.hide();
      $scope.items = Cart.getTotalItems();
      $scope.prices = Cart.getTotalPrice();
    };

  $ionicModal.fromTemplateUrl('myModalContent.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  $scope.index = function (index) {
    console.log(index);
    $scope.indx = index;
  };

  $scope.$watch('menu',function(){
      var price_ea = $scope.menu.menu_price;
      if(typeof $scope.menu.size_id != "undefined") {
         price_ea = $scope.menu.size_id.size_price;
         if($scope.menu.size_id.detailed == 1) {
            price_ea = $scope.menu.size_attribute_id[$scope.indx].price;
            $scope.menu.size_index = $scope.indx;
          }
      }
      var price_attr = 0;
      angular.forEach($scope.menu.attr,function(value,key){
      if(value.selected == true) {
          price_attr += value.attribute_price;
      }
      });
      $scope.total = $scope.menu.qty * (price_ea + price_attr);
  },true);

  Cart.init();
  $scope.items = Cart.getTotalItems();
  $scope.prices = Cart.getTotalPrice();

  $scope.goToCart = function() {
    $location.path("/cart/"+$scope.outlet_id+"/"+$scope.brand_id);
  };
}).directive('cartcontents',function() {
  return {
    restrict : 'E',
    templateUrl: 'cartcontents-template.html'
  };
});

app.controller('locationCtrl',function($scope,$http,$ionicLoading,Search,$location,Customer) {
  var areaJson = Search.getArea();
  $scope.searchInput = true;
  $scope.areaCoverage = 0;
  $scope.latitude = -6.219260;
  $scope.longitude = 106.812410;
  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
  });
  $scope.$on('state.login', function () {
      $scope.logged_in = true;
  });

  $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
  };
  $scope.hide = function(){
      $ionicLoading.hide();
  };

  var mapOptions = {  center: new google.maps.LatLng($scope.latitude,$scope.longitude),
            zoom : 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
           };

  $scope.map =  new google.maps.Map(document.getElementById('map'), mapOptions);
  var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng($scope.latitude,$scope.longitude),
                map: $scope.map,
                draggable: true,
                title: "My Location"
        });
  var input = document.getElementById('addr_input');
  var autooption = {
    componentRestrictions : { country: 'id' }
  };
  var autocomplete = new google.maps.places.Autocomplete(input,autooption);

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    myLocation.setVisible(false);
    $scope.areaCoverage = 0;
    var place = autocomplete.getPlace();
    var latlng = place.geometry.location;
    $scope.latitude = latlng.lat();
    $scope.longitude = latlng.lng();
    $scope.map.setCenter(latlng);
    myLocation.setPosition(latlng);
    myLocation.setVisible(true);
    Search.addLoc($scope.latitude,$scope.longitude);
    angular.forEach(areaJson.outlet, function(value,key){
        var pathArray = google.maps.geometry.encoding.decodePath(value.area);
        var pathPoly = new google.maps.Polygon({
          path: pathArray
        });
        if(google.maps.geometry.poly.containsLocation(latlng,pathPoly)) {
            Search.setOutlet(value.id);
            $scope.areaCoverage = 1;
        }
    });
    $scope.$apply();
  });

  google.maps.event.addListener(myLocation,'dragend',function(){
    var latlng = myLocation.getPosition();
    $scope.areaCoverage = 0;
    $scope.latitude = latlng.lat();
    $scope.longitude = latlng.lng();
    $scope.map.setCenter(latlng);
    var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
    $http.get(httpz).success(function(data){
        input.value = data.results[0].formatted_address;
    });
    Search.addLoc($scope.latitude,$scope.longitude);
    angular.forEach(areaJson.outlet, function(value,key){
        var pathArray = google.maps.geometry.encoding.decodePath(value.area);
        var pathPoly = new google.maps.Polygon({
          path: pathArray
        });
        if(google.maps.geometry.poly.containsLocation(latlng,pathPoly)) {
            Search.setOutlet(value.id);
            $scope.areaCoverage = 1;
        }
    });
  });
});

app.controller('cartCtrl',function($scope,$http,$stateParams,$ionicModal,$ionicLoading,Cart,Customer,$location,$ionicPopup,Search) {
  $scope.outlet_id = $stateParams.outlet_id;
  $scope.brand_id = $stateParams.brand_id;
  $scope.serviceType = Search.getType();
  $scope.data = {};
  $scope.data.datetimetype = 1;
  $scope.data.datetime = new Date();
  var momentz = moment($scope.data.datetime);
  Cart.updateTime($scope.data.datetimetype,momentz.unix());
  $scope.min_hit = false;

  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
  });

  if($scope.serviceType == 1) {
    $scope.data.selected = Search.getOutlet();
    $scope.areaJson = Search.getArea();
  }

  $scope.items = Cart.getAll();
  var totalItems = Cart.getTotalItems();
  if(totalItems == 0)
     $location.path("/order/"+$scope.outlet_id+"/"+$scope.brand_id+"/");

  var totalPrice = 0;
  angular.forEach($scope.items,function(value,key){
    var price_ea = parseInt(value.menu_price);
    if(value.size_id) {
      price_ea = parseInt(value.size_id.size_price);
    }
    totalPrice += parseInt(value.qty) * price_ea;
    if(value.attr) {
      angular.forEach(value.attr,function(value1,key1) {
        totalPrice += parseInt(value1.attribute_price) * parseInt(value.qty);
      });
    }
  });

  $scope.totalPrice = totalPrice;
  $scope.totalItems = totalItems;

  var urlz = url + "/getFees.php?outlet_id="+$scope.outlet_id+"&brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
  $http.jsonp(urlz).success(function(data){
      $scope.tax_service_charge = data.charge.tax_service_charge;
      $scope.delivery_fee = data.charge.delivery_fee;
      $scope.min_transaction = data.charge.min_transaction;
      if($scope.serviceType == 1) {
        $scope.delivery_fee = 0;
        $scope.min_transaction = 0;
        $scope.min_hit = true;
      }
      Cart.updatePrice($scope.tax_service_charge,$scope.delivery_fee);
      $scope.grandtotal = ($scope.totalPrice*$scope.tax_service_charge/100) + $scope.totalPrice + $scope.delivery_fee;
      if($scope.totalPrice > $scope.min_transaction)
        $scope.min_hit = true;
  });



  $scope.deleteItem = function(index) {
    Cart.removeItem(index);
    $scope.items = Cart.getAll();
    var totalItems = Cart.getTotalItems();
    $scope.totalPrice = Cart.getTotalPrice();
    $scope.totalItems = totalItems;
    if(totalItems == 0)
      $location.path("/order/"+$scope.outlet_id+"/"+$scope.brand_id+"/");
    $scope.grandtotal = ($scope.totalPrice*$scope.tax_service_charge/100) + $scope.totalPrice + $scope.delivery_fee;
    if($scope.totalPrice > $scope.min_transaction)
      $scope.min_hit = true;
    else
      $scope.min_hit = false;
  };

  $ionicModal.fromTemplateUrl('datetime-template.html', {
    id: '1',
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal1 = modal;
  });

  $ionicModal.fromTemplateUrl('edit-order-template.html', {
    id: '2',
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal2 = modal;
  });

  $scope.$on('$destroy', function () {
    $scope.modal1.remove();
    $scope.modal2.remove();
  });

  $scope.openModal = function (index, itemId){
    if(index == 1)
      $scope.modal1.show();
    else{
        $scope.item = Cart.getItem(itemId);
        $scope.menu_id = $scope.item.menu_id;
        $scope.indexItem = itemId;
        $scope.menu = {};
        var urlLogin = url + "/menuInformation.php?menu_id="+$scope.menu_id+"&callback=JSON_CALLBACK";
        $http.jsonp(urlLogin).success(function(data){
            $scope.menu = data.menu;
            $scope.menu.qty = $scope.item.qty;
            $scope.menu.instructions = $scope.item.instructions;
            var idx = 0;
            angular.forEach($scope.menu.attr,function(value,key){
              angular.forEach($scope.item.attr,function(value1,key1){
                if(value.attribute_id == value1.attribute_id){
                  $scope.menu.attr[idx].selected = $scope.item.attr[idx].selected;
                }
              });
              idx = idx + 1;
            });
            if(data.menu.size.length>0) {
              $scope.menu.size_id = $scope.menu.size[0];
            }
        });
        $scope.modal2.show();
    }
  };

  $scope.updateToCart = function (inputs, index) {
    delete inputs['size'];
    delete inputs['menu_description'];
    var temp = [];
    angular.forEach(inputs.attr,function(value,key){
      if(value.selected == true) {
        temp.push(value);
      }
    });
    if(temp.length == 0)
      delete inputs['attr'];
    else
      inputs.attr = temp;

    Cart.addItem(inputs);
      $scope.modal2.hide();
    $scope.deleteItem(index);
  };

  $scope.closeModal = function(index) {
      if(index == 1) {
        $scope.data.datetimetype = 1;
        $scope.data.datetime = new Date();
        $scope.modal1.hide();
        var momentz = moment($scope.data.datetime);
        Cart.updateTime($scope.data.datetimetype,momentz.unix());
      }else{
        $scope.modal2.hide();
      }
  };

  $scope.saveModal = function(index) {
    if(index == 1) {
      $scope.data.datetimetype = 2;
      $scope.modal1.hide();
      var momentz = moment($scope.data.datetime);
      Cart.updateTime($scope.data.datetimetype,momentz.unix());
      $scope.toCheckout();
    } else {

    }
  };

  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Mininum Order',
       template: 'Minimum Order untuk Delivery tidak Tercapai'
     });
  };

  $scope.toCheckout = function() {
      if(Customer.isLogged()) {
        $location.path('/checkout/'+$scope.outlet_id+'/'+$scope.brand_id);
      }
      else {
        $location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
      }
  };
});

app.controller('checkoutCtrl',function($scope,$http,$stateParams,$ionicPopup,$ionicLoading,Cart,Search,$location,Customer) {
  $scope.outlet_id = $stateParams.outlet_id;
  $scope.brand_id = $stateParams.brand_id;
  $scope.serviceType = Search.getType();
  $scope.order_datetime = moment.unix(Cart.getDeliveryTime()).format('YYYY-MM-DD H:mm:ss');
  $scope.order_type = Cart.getDeliveryType();
  $scope.logged_in = Customer.isLogged();
  $scope.addressInput = {};
  $scope.check = true;
  $scope.deliveryInstruction = {};
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
      $location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
  });
  if($scope.logged_in == false) {
      $location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
  }
  $scope.items = Cart.getAll();
  $scope.totalPrice = parseInt(Cart.getTotalPrice());
  $scope.totalItems = Cart.getTotalItems();
  $scope.tax_service_charge = Cart.getTaxCharge()/100 * $scope.totalPrice;

  if($scope.serviceType == 1) {
    $scope.pickupLocation = Search.getOutletDetails();
  } else {
    $scope.deliveryAddress = Search.getDeliveryAddress();
    if($scope.deliveryAddress!=0) {
      $scope.addr = Customer.getAddressById($scope.deliveryAddress);
    } else {
      $scope.deliveryType = Search.getDeliveryType();
    }
  }
  $scope.checkQuestions = function() {
    if ($scope.addressInput.address_name.length > 1) {
      if($scope.addressInput.address_content.length > 1) {
        if ($scope.addressInput.patokan.length > 1) {
          $scope.check = false;
        }
      }
    }
    else {
      $scope.check = true;
    }

    return $scope.check;
  };

  $scope.saveAddress = function(address) {
    $scope.addressInput.latitude = Search.getLat();
    $scope.addressInput.longitude = Search.getLng();
    $scope.addressInput.customer_id = Customer.getCustomerID();

    $http({
        url: url + "/saveAddress.php",
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: $scope.addressInput
    })
    .then(function(response) {
      if(response.data.address_id > 0) {
        Customer.setAddress(response.data.address);
        Search.setDeliveryAddress(response.data.address_id);
        $scope.deliveryAddress = Search.getDeliveryAddress();
        $scope.addr = Customer.getAddressById($scope.deliveryAddress);
      }
    });

  };

  $scope.placeOrder = function(){
    var test ={};
    test.items = Cart.getAll();
    test.customer_id = Customer.getCustomerID();
    test.outlet_id = $scope.outlet_id;
    test.brand_id = $scope.brand_id;
    test.tax_service_charge = $scope.tax_service_charge;
    test.delivery_fee = $scope.delivery_fee;
    test.deliveryInstruction = $scope.deliveryInstruction.data;
    test.payment_method = "cash";
    test.subtotal = Cart.getTotalPrice();
    test.order_type = Cart.getDeliveryType();
    test.order_datetime = Cart.getDeliveryTime();
    test.service_type = Search.getServiceType();
    if(test.service_type  == 2)
      test.address_id = Search.getDeliveryAddress();

    $http({
        url: url + "/placeOrder.php",
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: test
    })
    .then(function(response) {
      var order_id = response.data;
      if(order_id > 0) {
        $location.path('/confirmation/'+order_id);
      } else {

      }
    });

  };
});


app.controller('newAddressCtrl',function($scope,$http,$ionicLoading,$ionicModal,$location,Customer) {
  $scope.newAddress = [
    { index : 1, icon : "ion-android-pin", text : "Get Your Location", checked : false},
    { index : 2, icon : "ion-ios-list-outline", text : "Extra Guidance or Instructions", checked : false},
    { index : 3, icon : "ion-ios-paper", text : "Address Detail", checked : false}
  ];
  $scope.tab = {};
  $scope.addressInput = { 'address_selection' : 1 };
  $scope.latitude = -6.219260;
  $scope.longitude = 106.812410;

  $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
  };
  $scope.hide = function(){
      $ionicLoading.hide();
  };

  var mapOptions = {  center: new google.maps.LatLng($scope.latitude,$scope.longitude),
            zoom : 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
           };

  $ionicModal.fromTemplateUrl('newaddress-template.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  $scope.openModal = function (tab){
    $scope.tab = tab;
    $scope.modal.show();

    if($scope.tab == 1) {
    $scope.map =  new google.maps.Map(document.getElementById('map'), mapOptions);
      var myLocation = new google.maps.Marker({
                  position: new google.maps.LatLng($scope.latitude,$scope.longitude),
                  map: $scope.map,
            draggable: true,
                  title: "My Location"
      });
      if(navigator.geolocation) {
        myLocation.setVisible(false);
          navigator.geolocation.getCurrentPosition(function(position) {
          $scope.latitude = position.coords.latitude;
              $scope.longitude = position.coords.longitude;
              $scope.accuracy = position.coords.accuracy;
              $scope.$apply();

          var latlng = new google.maps.LatLng($scope.latitude,$scope.longitude);
          myLocation.setPosition(latlng);
          myLocation.setVisible(true);
              $scope.map.setCenter(latlng);

              var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
              $http.get(httpz).success(function(data){
                $scope.full_address = data.results[0].formatted_address;
              });
          $scope.newAddress[0].checked = true;
        });
      }
      google.maps.event.addListener(myLocation,'dragend',function(){
        var latlng = myLocation.getPosition();
        $scope.latitude = latlng.lat();
        $scope.longitude = latlng.lng();
        $scope.map.setCenter(latlng);
        var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
        $http.get(httpz).success(function(data){
            $scope.full_address = data.results[0].formatted_address;
        });
      });
    }
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
  $scope.saveAddress = function(address) {
    address.latitude = $scope.latitude;
    address.longitude = $scope.longitude;
    if(address.patokan)
      $scope.newAddress[1].checked = true;
    if(address.address_content)
      $scope.newAddress[2].checked = true;
      $scope.modal.hide();
    };
    $scope.commitAddress = function() {
      $scope.addressInput.customer_id = Customer.getCustomerID();
      $http({
        url: url + "/saveAddress.php",
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: $scope.addressInput
    })
    .then(function(response) {
      if(response.data.address_id > 0) {
        Customer.setAddress(response.data.address);
      }
    });
    $location.path('/my-address');
    }
});

app.controller('confirmationCtrl',function($scope,$http,$ionicLoading,$location,$stateParams,Customer) {
  $scope.order_id = $stateParams.order_id;
  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
  });
  $scope.customer_email = Customer.getCustomerEmail();
});


app.controller('faqCtrl',function($scope,$location,$stateParams,$ionicNavBarDelegate){
  $scope.section = $stateParams.page;
  $scope.gozBack = function() {
    $location.path('#/faq/');
  };
});

app.controller('promotionCtrl',function($scope,$location,$stateParams,$ionicNavBarDelegate){
  $scope.section = $stateParams.page;
  $scope.gozBack = function() {
    $location.path('/promotion/');
  };
});

app.controller('tcCtrl',function($scope,$location,$stateParams){
  $scope.section = $stateParams.page;
  $scope.goBack = function() {
      $location.path('/tc/');
    };
});

app.controller('feedbackCtrl',function($scope,$location,$stateParams,Customer,$http){
  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
    });
    $scope.$on('state.login', function () {
      $scope.logged_in = true;
    });
  if($scope.logged_in == true)
  {
    $scope.customer = Customer.getCustomer();
    $scope.support = {};
    $scope.success_login = false;
    $scope.support.name = $scope.customer.customer_name;
    $scope.support.email = $scope.customer.customer_email;
    $scope.support.type = "support";

    $scope.submitSupport = function(form) {
      $http.defaults.useXDomain = true;
      $http({
          url: url + "/feedback.php",
          method: "POST",
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
          data: $scope.support
      })
      .then(function(response) {
        console.log(response.data);

      });

      form.$setPristine();
          form.$setUntouched();
      $scope.success_login = true;
      $scope.support.message = "";
    };
  }
});

app.controller('aboutCtrl',function($scope,$stateParams,$ionicModal,$http,Cart,$ionicLoading,$location,Customer){
  $scope.openModal = function (data){
    $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

  $ionicModal.fromTemplateUrl('aboutUsModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
});

app.controller('storeListCtrl',function($scope,$rootScope,Search){
  $rootScope.reloadData();
  $scope.list = Search.getArea();
});

app.controller('menuCtrl',function($scope,$stateParams,$http,Customer){
  $scope.brand_id = 1;
  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
    });
  var urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
  console.log(urlLogin);
  $http.jsonp(urlLogin).success(function(data){
      $scope.menuCategories = data.category;
  });
});

app.controller('menuCtrl2',function($scope,$stateParams,$ionicModal,$http,$ionicLoading,$location,Customer){
  $scope.brand_id = 1;
  $scope.tab = $stateParams.category;
  $scope.menuz = [];
  $scope.menu = {};
  var arrayLoaded = [];

  $scope.logged_in = Customer.isLogged();
  $scope.$on('state.update', function () {
      $scope.logged_in = false;
    });

  $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
  };
  $scope.hide = function(){
      $ionicLoading.hide();
  };


  var urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
  $http.jsonp(urlLogin).success(function(data){
    $scope.menuCategories = data.category;
    if($scope.tab !== "") {
      urlLogin = url + "/outletMenu.php?category_id="+$scope.tab+"&callback=JSON_CALLBACK";
      $http.jsonp(urlLogin).success(function(data){
        $scope.menuz[$scope.tab] =data.menu;
        arrayLoaded.push($scope.tab);
        $scope.menus = $scope.menuz[$scope.tab];
      });
    }
  });
  $scope.loadMenu = function(a) {
    $scope.tab = a;
    if(arrayLoaded.indexOf(a) == -1 ) {
      urlLogin = url + "/outletMenu.php?category_id="+a+"&callback=JSON_CALLBACK";
      $http.jsonp(urlLogin).success(function(data){
        $scope.show();
        $scope.menuz[a] =data.menu;
        arrayLoaded.push(a);
        $scope.menus = $scope.menuz[a];
        $scope.hide();
      });
    } else {
      $scope.menus = $scope.menuz[a];
    }
  }

  $scope.openModal = function (data){
    $scope.menu_id = data;
    $scope.menu = {};
    var urlLogin = url + "/menuInformation.php?menu_id="+$scope.menu_id+"&callback=JSON_CALLBACK";
    $http.jsonp(urlLogin).success(function(data){
      $scope.menu = data.menu;
      $scope.menu.qty = 1;
      if(data.menu.size.length>0) {
        $scope.menu.size_id = $scope.menu.size[0];
      }
      $scope.modal.show();
    });

    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

  $ionicModal.fromTemplateUrl('myModalContent.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
});
