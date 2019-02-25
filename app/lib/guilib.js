/**
* File for manage the creation of the html
*
*
*/

//dependencies
var path = require('path');
var fs = require('fs');
// instantiate the object
var guilib = {};


guilib.getHtml = function(templateName,folder){
  var data = '';
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  if(templateName){
    var templatesDir = path.join(__dirname,folder);
    try{
        data = fs.readFileSync(templatesDir+'/'+templateName,'utf-8');
    }catch(e){
      data = '';
      console.log(e);
    }
  } else {
    data = '';
  }
  return data;
};

guilib.getStaticAsset = function(templateName,folder){
  var data = '';
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  if(templateName){
    var templatesDir = path.join(__dirname,folder);
    try{
        data = fs.readFileSync(templatesDir+'/'+templateName);
    }catch(e){
      data = '';
    }
  } else {
    data = '';
  }
  return data;
};

guilib.interpolate = function(str,data){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  // For each key in the data object, insert its value into the string at the corresponding placeholder
 for(var key in data){
    if(data.hasOwnProperty(key) && typeof(data[key] == 'string')){
       var replace = data[key];
       var find = '{'+key+'}';
       str = str.replace(find,replace);
    }
 }
 return str;
}

module.exports = guilib;
