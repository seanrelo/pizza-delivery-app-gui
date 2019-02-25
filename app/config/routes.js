/**
* File for the routes of the API
*
**/

// Dependencies
var user = require('../controllers/userController');
var token = require('../controllers/tokenController');
var menu = require('../controllers/menuController');
var cart = require('../controllers/cartController');
var order = require('../controllers/orderController');
var page = require('../controllers/pageController');
var static = require('../controllers/staticController')
// intantiate the routes object
routes = {
  'user':{
    'validMethod':['post','get','put','delete'],
    'controller': user
  },
  'token':{
    'validMethod':['post','delete'],
    'controller': token
  },
  'menu':{
    'validMethod':['get'],
    'controller':menu
  },
  'cart':{
    'validMethod':['post','get','put','delete'],
    'controller':cart
  },
  'order':{
    'validMethod':['post'],
    'controller': order
  },
  'index':{
    'validMethod':['get'],
    'controller':page
  },
  'favicon.ico':{
    'validMethod':['get'],
    'controller':static
  },
  'public/app.js':{
    'validMethod':['get'],
    'controller':static
  },
  'public/app.css':{
    'validMethod':['get'],
    'controller':static
  },
  'logo.png':{
    'validMethod':['get'],
    'controller':static
  },
  'pizza_home.png':{
    'validMethod':['get'],
    'controller':static
  },
  'account/create.html':{
    'validMethod':['get'],
    'controller':page
  },
  'login/login.html':{
    'validMethod':['get'],
    'controller':page
  },
  'products/all.html':{
    'validMethod':['get'],
    'controller':page
  },
  'cart/cart.html':{
    'validMethod':['get'],
    'controller':page
  }
};

routes.getController = function(data,callback){
  // Validate if the method of the request is valid
  try{
    if(routes[data.path].validMethod.indexOf(data.method) > -1){
      routes[data.path].controller.principal(data,callback);
    }else{
      callback(405);
    }
  }catch(e){
    console.log(e);
    callback(500,{'Error':'Could not execute the request'});
  }
};

// export the routes module
module.exports = routes;
