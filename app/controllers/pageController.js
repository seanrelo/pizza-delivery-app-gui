/**
* File for controller the page content
*
/*/

//dependencies
var guilib = require('../lib/guilib')
var params = require('../config/params');
// Instantite the object
var page = {};

// Principal method of the controller
page.principal = function(data,callback){
  page[data.method](data,callback);
};


page.get = function(data,callback){
  var path = typeof(data.path) == 'string' && data.path.length > 0 ? data.path : false;
  if(path){
    var index = guilib.getHtml('index.html','/../gui/pages/');
    var header = guilib.getHtml('_header.html','/../gui/templates/');
    var footer = guilib.getHtml('_footer.html','/../gui/templates/');

    index = index.replace('{header}',header);
    index = index.replace('{footer}',footer);

    index = guilib.interpolate(index,params.templateGlobals);

    var content = '';
    if(path !== 'index'){
      content = guilib.getHtml(data.path,'/../gui/pages/');
    }else{
      content = guilib.getHtml('home.html','/../gui/pages/');
    }
    index = index.replace('{content}',content);
    callback(200,index,'html');
  }else{
    callback(404,undefined,'html');
  }
}

module.exports =  page;
