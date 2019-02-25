/**
* File for controller the page favicon
*
/*/

//dependencies
var guilib = require('../lib/guilib')
// Instantite the object
var static = {};

// Principal method of the controller
static.principal = function(data,callback){
  static[data.method](data,callback);
};


static.get = function(data,callback){
  var path = typeof(data.path) == 'string' && data.path.length > 0 ? data.path : false;
  if(path){
    if(path.indexOf('.ico') > -1){
      var ico = guilib.getStaticAsset(data.path,'/../gui/assets/images/');
      callback(200,ico,'favicon');
    }
    if(path.indexOf('.css') > -1){
      var css = guilib.getStaticAsset(data.path,'/../gui/assets/css/');
      callback(200,css,'css');
    }
    if(path.indexOf('.js') > -1){
      var js = guilib.getStaticAsset(data.path,'/../gui/assets/javaScript/');
      callback(200,js,'javascript');
    }
    if(path.indexOf('.png') > -1){
      var png = guilib.getStaticAsset(data.path,'/../gui/assets/images/');
      callback(200,png,'png');
    }
  }else{
    callback(404,undefined,'html');
  }
};

module.exports = static;
