'use strict';

var appShop = angular.module('appShop', ['ui.bootstrap', 'ngCookies', 'autocomplete']);

appShop.controller('ResponsiveCarousel', function ($scope) {
    $scope.carouselTimer = 5000;
    $scope.slides = [
        {
            image: 'images/banner.jpg',
            cap1: 'Leo Ventoni',
            cap2: 'Оптовый магазин кожгалантереи',
            cap3: 'Наша компания работает на Российском рынке более 15 лет.Основным направлением деятельности является оптовая торговля,в который мы уже много лет удерживаем позицию крупнейшего поставщикакачественной кожгалантереи и эффектных аксессуаров.',
            cap4: 'Познакомиться поближе'
        },
        {
            image: 'images/banner.jpg',
            cap1: 'Leo Ventoni',
            cap2: 'Оптовый магазин кожгалантереи',
            cap3: 'Наша компания работает на Российском рынке более 15 лет.Основным направлением деятельности является оптовая торговля,в который мы уже много лет удерживаем позицию крупнейшего поставщикакачественной кожгалантереи и эффектных аксессуаров.',
            cap4: 'Познакомиться поближе'
        },
        {
            image: 'images/banner.jpg',
            cap1: 'Leo Ventoni',
            cap2: 'Оптовый магазин кожгалантереи',
            cap3: 'Наша компания работает на Российском рынке более 15 лет.Основным направлением деятельности является оптовая торговля,в который мы уже много лет удерживаем позицию крупнейшего поставщикакачественной кожгалантереи и эффектных аксессуаров.',
            cap4: 'Познакомиться поближе'
        },
        {
            image: 'images/banner.jpg',
            cap1: 'Leo Ventoni',
            cap2: 'Оптовый магазин кожгалантереи',
            cap3: 'Наша компания работает на Российском рынке более 15 лет.Основным направлением деятельности является оптовая торговля,в который мы уже много лет удерживаем позицию крупнейшего поставщикакачественной кожгалантереи и эффектных аксессуаров.',
            cap4: 'Познакомиться поближе'
        }]
});



appShop.controller('GetNews', function ($scope, $http) {
    $http.get('data/news.json').success(function(data) {
        $scope.news = data.news;
    });
});


appShop.filter('isCategory', function(){
    return function(values, catId) {
        if(!catId) {
            return values;
        }
        return values.filter(function(value){
            return value.category === catId;
        })
    }
});



appShop.controller('StoreController', ['$scope','$cookies', '$http', function($scope,$cookies, $http){
    $http.get('data/items.json').success(function(data) {
        $scope.items = data.products;
        $scope.categories = data.categories;
    });



    $scope.filteredTodos = [];
    $scope.cart = [];
    $scope.total = 0;
    $scope.total_count = 0;


    $scope.currentPage = 1 , $scope.numPerPage = 8 ;


    $scope.showCart = false;
    if(!angular.isUndefined($cookies.get('total'))){
        $scope.total = parseFloat($cookies.get('total'));
    }
    if(!angular.isUndefined($cookies.get('total_count'))){
        $scope.total_count = parseInt($cookies.get('total_count'));
    }
    if (!angular.isUndefined($cookies.get('cart'))) {
        $scope.cart =  $cookies.getObject('cart');
    }


    $scope.addItemToCart = function(product){

        if ($scope.cart.length === 0){
            product.count = 1;
            $scope.cart.push(product);
        } else {
            var repeat = false;
            for(var i = 0; i< $scope.cart.length; i++){
                if($scope.cart[i].id === product.id){
                    repeat = true;
                    $scope.cart[i].count +=1;
                }
            }
            if (!repeat) {
                product.count = 1;
                $scope.cart.push(product);
            }
        }
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);


        $cookies.putObject('cart', $scope.cart,  {'expires': expireDate});
        $scope.cart = $cookies.getObject('cart');

        $scope.total += parseFloat(product.price);
        $scope.total_count += parseInt(product.count);
        $cookies.put('total', $scope.total,  {'expires': expireDate});
        $cookies.put('total_count', $scope.total_count,  {'expires': expireDate});
    };

    $scope.removeItemCart = function(product){

        if(product.count > 1){
            product.count -= 1;
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
            $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
            $scope.cart = $cookies.getObject('cart');
        }
        else if(product.count === 1){
            var index = $scope.cart.indexOf(product);
            $scope.cart.splice(index, 1);
            expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
            $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
            $scope.cart = $cookies.getObject('cart');

        }

        $scope.total -= parseFloat(product.price);
        $scope.total_count -= parseInt(product.count);
        $cookies.put('total', $scope.total,  {'expires': expireDate});
        $cookies.put('total_count', $scope.total_count,  {'expires': expireDate});

    };

    $scope.selectedGroup = '';
    $scope.setGroup = function(group) {
        $scope.selectedGroup = group;
    }
    $scope.setActive = function(menuItem) {
        $scope.activeMenu = menuItem
    }
    $scope.pageChanged = function() {
        var startPos = ($scope.currentPage - 1) * $scope.numPerPage;
        console.log($scope.currentPage);
    };


}]);


