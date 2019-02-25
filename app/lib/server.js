/**
* File for server functionality
*
*
*/


// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var params = require('../config/params');
var routes = require('../config/routes');
var objectUtil = require('../util/objectUtil');

// intantiate the server module objet
server = {};


//create the server
server.httpServer = http.createServer(function(req,res){
  // Call the serverProccesing method
  server.serverProccesing(req,res);
});

server.serverProccesing = function(req,res){
  // get the url and parse to an URL object
  var parsedUrl = url.parse(req.url,true);

  // Get path
  var path =  parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query String as an objet
  var queryStringObject = parsedUrl.query;

  // get Http method
  var method = req.method.toLowerCase();

  // get the headers as an objet
  var headers = req.headers;

  // Get the payload for a POST or PUT Request
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  // For every event of data, we append the data to the buffer
  req.on('data',function(data){
    buffer += decoder.write(data);
  });

  // On the end event process the payload
  req.on('end',function(){
    buffer += decoder.end();

    var data = {
      'path':trimmedPath,
      'query': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': objectUtil.perseJsonToObject(buffer)
    }
    routes.getController(data,function(statusCode,payload,contentType){
      // IF the content type is not string put json - this is for the rest-api part
      contentType = typeof(contentType) == 'string' ? contentType : 'json';

      // Use the status code called back by the handler or default
      statudcode = typeof(statusCode) == 'number' ? statusCode : 200;

      if(contentType == 'json'){
        res.setHeader('Content-Type','application/json');
        // Use the payload called bacj by the handler or dedault to
        payload = typeof(payload) == 'object' ? payload: {};
        // Conver the payload  to a String
        var payloadString = JSON.stringify(payload);
      }
      if(contentType == 'html'){
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof(payload) == 'string'? payload : '';
      }
      if(contentType == 'favicon'){
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if(contentType == 'plain'){
        res.setHeader('Content-Type', 'text/plain');
           payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if(contentType == 'css'){
         res.setHeader('Content-Type', 'text/css');
         payloadString = typeof(payload) !== 'undefined' ? payload : '';
       }

       if(contentType == 'png'){
         res.setHeader('Content-Type', 'image/png');
         payloadString = typeof(payload) !== 'undefined' ? payload : '';
       }

       if(contentType == 'jpg'){
         res.setHeader('Content-Type', 'image/jpeg');
         payloadString = typeof(payload) !== 'undefined' ? payload : '';
       }
       if(contentType == 'javascript'){
         res.setHeader('Content-Type', 'text/javascript');
         payloadString = typeof(payload) !== 'undefined' ? payload : '';
       }


      // Return the response
      res.writeHead(statusCode);
      res.end(payloadString);
    });

  });
};

// Function to intantiate the server
server.init = function(){
  server.httpServer.listen(params.port,function(){
    // The \x1b[33m is yellow color and  \x1b[0m is for reset the terminal
    console.log('\x1b[33m%s\x1b[0m', 'The server is running in port:'+params.port+' and the environment is:'+params.envName);
  });
};

// Export the server
module.exports = server;
