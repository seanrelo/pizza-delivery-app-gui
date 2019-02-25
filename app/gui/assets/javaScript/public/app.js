/*
*
* File for the front end functionality
*
*/


 var app = {};

 app.menuList = [];
 app.cartList = [];

 app.getToken = function(){
   var tokenReturn = '';
   var token = document.cookie;
   var tokens = token.split(";")
   for(var i=0;i<tokens.length;i++){
     var attribute = tokens[i].split("=");
     if(attribute[0]== 'token'){
       console.log(attribute[1]);
       tokenReturn=attribute[1];
     }
   }
   return tokenReturn;
 }


app.createUser = function(){
  var iFirstName = document.getElementById("firstName");
  var iLastName = document.getElementById("lastName");
  var iEmail = document.getElementById("email");
  var iStreet = document.getElementById("streetAddress");
  var iPassword = document.getElementById("password");

  if(!iFirstName.value || iFirstName.value == ''){
    alert("Please put your fisrt name");
    return false;
  }
  if(!iLastName.value || iLastName.value == ''){
    alert("Please put your last name");
    return false;
  }
  if(!iEmail.value || iEmail.value == ''){
    alert("Please put your email");
    return false;
  }
  if(!iStreet.value || iStreet.value ==''){
    alert("Please put your street address");
    return false;
  }
  if(!iPassword.value || iPassword.value == ''){
    alert("Please put a password");
    return false;
  }

  var userObject = {
  	"firstName":iFirstName.value,
  	"lastName": iLastName.value,
  	"email":iEmail.value,
  	"streetAddress" : iStreet.value,
  	"password":iPassword.value
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/user', true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;
          try{
            var parsedResponse = JSON.parse(responseReturned);
          } catch(e){
            console.log(e);
          }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(userObject);
  xhr.send(payloadString);

}

app.login = function(){
  var iEmail = document.getElementById("email");
  var iPassword = document.getElementById("password");

  if(!iEmail.value || iEmail.value == ''){
    alert("Please put your Email");
    return false;
  }
  if(!iPassword.value || iPassword.value == ''){
    alert("Please put your password");
    return false;
  }

  var tokenObject = {
  	"email":iEmail.value,
  	"password": iPassword.value
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/token', true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;
          try{
            var parsedResponse = JSON.parse(responseReturned);
            console.log(parsedResponse);
            localStorage.setItem('token', parsedResponse.Success.tokenId);
            localStorage.setItem('email',tokenObject.email);
            location.pathname = '/products/all.html';
            //document.cookie = "token="+parsedResponse.Success.tokenId;
          } catch(e){
            console.log(e);
          }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(tokenObject);
  xhr.send(payloadString);
}

app.loadTabla = function(){
  var elemento = document.getElementById("divTabla");
  var token = localStorage.getItem('token');
  console.log(token);
  if(token){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/menu', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("token", token);

    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE) {
          var statusCode = xhr.status;
          var responseReturned = xhr.responseText;
            try{
              var parsedResponse = JSON.parse(responseReturned);
              app.menuList = parsedResponse;
              var htmlTable = '<table id="menu"><tr><td>Check</td><td><h1>Pizza</h1></td><td><h1>Price</h1></td></tr>'
              for(var i=0;i<parsedResponse.length;i++){
                htmlTable += '<tr>';
                htmlTable += '<td><input type="checkbox" name="'+parsedResponse[i].name+'" value="'+parsedResponse[i].pizzaId+'" onclick="app.addProducto('+parsedResponse[i].pizzaId+')"></td>'
                htmlTable += '<td>'+parsedResponse[i].name+'</td>';
                htmlTable += '<td>'+parsedResponse[i].price+'</td>';
                htmlTable += '</tr>';
              }
              htmlTable += '</table>';
              htmlTable +="<br/><br/><br/>";
              htmlTable +='<input type="button" value="add to cart" onclick="app.createCart()"/>';
              elemento.innerHTML = htmlTable;
            } catch(e){
              console.log(e);
            }
        }
    }

    // Send the payload as JSON
    xhr.send();
  }else{
    var htmlTable = '<p> Please login to see the products</p>';
    elemento.innerHTML = htmlTable;
  }
}

app.addProducto = function(id){
  for(var i=0;i<app.menuList.length;i++){
    var menu = app.menuList[i];
    if(menu.pizzaId == id){
      app.cartList.push(menu);
    }
  }
}

app.createCart = function(){
  var token = localStorage.getItem('token');
  var email = localStorage.getItem('email');
  if(app.cartList.length > 0){
    var cartObject = {
      "email":email,
      "items":app.cartList
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/cart', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("token", token);

    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE) {
          var statusCode = xhr.status;
          var responseReturned = xhr.responseText;
            try{
              var parsedResponse = JSON.parse(responseReturned);
              console.log(parsedResponse);
              if(parsedResponse.Error){
                alert("Error:"+parsedResponse.Error);
              }else{
                alert(parsedResponse.Success);
                location.pathname = '/cart/cart.html';
              }
              //document.cookie = "token="+parsedResponse.Success.tokenId;
            } catch(e){
              console.log(e);
            }
        }
    }

    // Send the payload as JSON
    var payloadString = JSON.stringify(cartObject);
    xhr.send(payloadString);
  }else{
    alert("please add products to the cart");
  }
}

app.loadTablaCart = function(){
  var elemento = document.getElementById("divCart");
  var total = 0;
  var token = localStorage.getItem('token');
  var email = localStorage.getItem('email');
  var xhr = new XMLHttpRequest();
  xhr.open("GET", '/cart?email='+email, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("token", token);

  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;
          try{
            var parsedResponse = JSON.parse(responseReturned);
            app.cartList = parsedResponse.items;
            if(app.cartList.length > 0){
              var htmlTable = '<table id="cart"><tr><td><h1>Pizza</h1></td><td><h1>Price</h1></td></tr>';
              for(var i=0;i<app.cartList.length;i++){
                htmlTable += '<tr>';
                htmlTable += '<td>'+app.cartList[i].name+'</td>';
                htmlTable += '<td>'+app.cartList[i].price+'</td>';
                htmlTable += '</tr>';
                total += app.cartList[i].price;
              }
              htmlTable += '<tr>';
              htmlTable += '<td>Total</td>';
              htmlTable += '<td>'+total+'</td>';
              htmlTable += '</tr>';
              htmlTable += '</table>';
              htmlTable +="<br/><br/><br/>";
              htmlTable +='<input type="button" value="Create order" onclick="app.createOrder()"/>';
              elemento.innerHTML = htmlTable;
            }
          } catch(e){
            console.log(e);
          }
      }
  }

  // Send the payload as JSON
  xhr.send();
}

app.createOrder = function(){
  var token = localStorage.getItem('token');
  var email = localStorage.getItem('email');

  var orderObject ={
    "email":email
  };
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/order', true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("token", token);

  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;
          try{
            var parsedResponse = JSON.parse(responseReturned);
            console.log(parsedResponse);
            if(parsedResponse.Error){
              alert("Error:"+parsedResponse.Error);
              app.deleteCart();
            }else{
              alert(parsedResponse.Success);
              app.deleteCart();
            }
            //document.cookie = "token="+parsedResponse.Success.tokenId;
          } catch(e){
            console.log(e);
          }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(orderObject);
  xhr.send(payloadString);
}


app.deleteCart = function(){
  var token = localStorage.getItem('token');
  var email = localStorage.getItem('email');
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", '/cart?email='+email, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("token", token);

  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;
          try{
            var parsedResponse = JSON.parse(responseReturned);
            console.log(parsedResponse);
            location.pathname = '/products/all.html';
          } catch(e){
            console.log(e);
          }
      }
  }

  // Send the payload as JSON
  xhr.send();
}

app.logout = function(){
  localStorage.setItem('token', "");
  localStorage.setItem('email',"");
  document.getElementById("logoutTag").href = "/login/login.html";
}
