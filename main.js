var app = angular.module("myApp", ["ui.router"]);
app.factory('myCart', function() {  
	return {
		data : {
      my_cart : [],
      cart_item: 0,
      cart_amount: 0,
      addMenu: function(product){
        var is_in_cart = false;
        var cart_index = 0;
        this.my_cart.forEach(function(item, index){
          if(item.product == product){
            is_in_cart = true;
            cart_index = index;
          }
        });
        if(is_in_cart){
          this.my_cart[cart_index].qty++;
        }else{
          this.my_cart.push({'product' : product, 'qty' : 1});
        }
        calc_cart(this);
      },
      cancelItem: function(cart_item){
        this.my_cart = this.my_cart.filter(function(el) {
          return el !== cart_item;
        });
        calc_cart(this);
      },
      updatePrice : function(){
        calc_cart(this);
      }
		}
	};
});
app.factory('myNav', function() {  
	return {
		data : {
      current_nav : "",
      changeNav: function(new_nav){
        this.current_nav = new_nav;
      }
		}
	};
});
var calc_cart = function(data){
  var cart_item = 0;
  var cart_amount = 0;
  data.my_cart.forEach(function(item, index){
    cart_item += item.qty;
    cart_amount += item.qty * item.product.price;
  });
  data.cart_item = cart_item;
  data.cart_amount = cart_amount;
}
app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/home');
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: './views/home.html?v=1',
    controller: function($scope, myNav){
      myNav.data.changeNav("home");
    }
  })
  .state('about', {
    url: '/about',
    templateUrl: './views/about.html',
    controller: function($scope, myNav){
      myNav.data.changeNav("about");
      $scope.about = restaurants.about;
    }
  })
  .state('product', {
    url: '/product',
    abstract: true,
    templateUrl: './views/product.html',
    controller: function($scope, myCart, myNav){
      myNav.data.changeNav("product");
      $scope.category_list = catagory;
    }
  })
  .state('product.category', {
    url: '/:categoryId',
    params: {categoryId: ''},
    views: {
      'productlist' : {
        templateUrl: './views/product_list.html',
        controller: function($scope, $stateParams, myCart){
          $scope.category = $stateParams.categoryId;
          $scope.product_list = product;
          console.log($scope.category);
          $scope.filters = {catagory: $scope.category};
          $scope.myCart = myCart.data;
        }
      },
    }
  })
  .state('contact', {
    url: '/contact',
    templateUrl: './views/contact.html',
    controller: function($scope, myNav){
      myNav.data.changeNav("contact");
      $scope.contact = restaurants.contact;
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: './views/login.html',
    controller: function($scope, myNav){
      myNav.data.changeNav("login");
      $scope.data = {
        login_name: '',
        password: ''
      };
      $scope.respDat = '';
      $scope.loginData = function(data){
        $scope.respDat = 'pending';
        console.log('call login data');
        if(data.login_name == '90n9' && data.password == 'gonggong'){
          $scope.respDat = 'login success';
        }else{
          $scope.respDat = 'login fail';
        }
      }
    }
  });
});
app.controller('cartController', function($scope, myCart){
  $scope.myCart = myCart.data;
});
app.controller('navController', function($scope, myNav){
  $scope.myNav = myNav.data;
});