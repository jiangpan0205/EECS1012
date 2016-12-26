/*http://192.168.0.22:8000/serve/TUNE/index.html*/


function albums(json) {
  var o = document.getElementById("output");
  for(var e=0;e<json.length;e++) {
    o.innerHTML += json[e].album + "<br>";
  }
}

function artistCallback(json) {
  //alert(JSON.stringify(json));
  var d = document.getElementById("output");
  d.appendChild(buildArtisPullDown(json));
  access("select distinct year from collection order by year", yearCallback);
}

function yearCallback(json){
  //alert(JSON.stringify(json));
  var d = document.getElementById("output");
  d.appendChild(buildYearPullDown(json));

  var b = document.createElement("button");
  b.innerHTML = "<b>Find</b>";
  b.setAttribute("id", "selction");
  d.appendChild(b);

  b.onclick = function() {find()};
}

function selectCallback(json) {
  console.log(JSON.stringify(json));
  queryCallBack();
  buildNewElement(json);
}

function find() {
  var a = document.getElementById("artist");
  var artistValue = a.options[a.selectedIndex].text;
  var y = document.getElementById("year");
  var yearValue = y.options[y.selectedIndex].text;

  if (a.selectedIndex == 0 && y.selectedIndex == 0) {
      var query = "select * from collection";
      access(query, selectCallback);
  }
  else if (a.selectedIndex == 0 && y.selectedIndex != 0)
  {
      var query = "select * from collection where year=" + yearValue;
      access(query, selectCallback);
  }
  else if (a.selectedIndex != 0 && y.selectedIndex == 0) {
    var query = "select * from collection where artist='" + artistValue + "'";
    access(query, selectCallback);
  }
  else if (a.selectedIndex != 0 && y.selectedIndex != 0) {
    var query = "select * from collection where artist='" + artistValue + "'and year=" + yearValue;
    access(query, selectCallback);
  }
}

function go() {
  access("select distinct artist from collection order by artist", artistCallback);
  //buildNewElement(json);
}

var ajax;
var acallback=null;
function access(query, callback)
{
  acallback = callback;
  ajax = new XMLHttpRequest();
  ajax.onreadystatechange = ajaxProcess;
  ajax.open("GET", "http://192.168.0.22:8000/sql?query=" + query);
  ajax.send(null);
}

function ajaxProcess() {
  if((ajax.readyState == 4)&&(ajax.status == 200)){
    ajaxCompleted(ajax.responseText);
  }
}

function ajaxCompleted(text) {
//  var output = document.getElementById("output");
  if(acallback != null) {
    var data = JSON.parse(text);
    acallback(data);
  }
}

function buildArtisPullDown(json) {
  var s = document.createElement("select");
  s.setAttribute("id", "artist");
  var h = document.createElement("option");
  h.innerHTML = "<b>Artists</b>";
  s.appendChild(h);
  for (var i = 0; i < json.length; i++) {
    var v = json[i].artist;
    var q = document.createElement("option");
    q.innerHTML = v;
    s.appendChild(q);
  }
  return s;
}

function buildYearPullDown(json) {
  var s = document.createElement("select");
  s.setAttribute("id", "year");

  var h = document.createElement("option");
  h.innerHTML = "<b> Year </b>";
  s.appendChild(h);

  for (var i = 0; i < json.length; i++) {
    var v = json[i].year;
    var q = document.createElement("option");
    q.innerHTML = v;
    s.appendChild(q);
  }
  return s;
}

function buildNewElement(json){
  var results = document.getElementById("results");

  for (var i = 0; i < json.length; i++) {
    var img = document.createElement("img");
    var newLine_1 = document.createElement("br");

    img.height = 100;
    img.width = 100;
    img.src= json[i].cover;
    results.appendChild(img);
    results.appendChild(newLine_1);
    var album = document.createElement("span");
    album.innerHTML = json[i].album + " " + json[i].price;
    results.appendChild(album);

    var button = document.createElement("button");
    button.innerHTML = "<b>Purchase</b>";
    results.appendChild(button);

    var newLine = document.createElement("br");
    results.appendChild(newLine);

    var button_id = json[i].id
    button.setAttribute("id", button_id);

    button.onclick = function() {
      purchase(this.id)
    };
    console.log(button_id);
  }

  return results;
}

function purchase(id) {
  //alert(id);
  access("select price, album, number, id from collection where id=" + id, purchaseCallback);

}

function purchaseCallback(json) {
  var elem = json[0];
  if (elem.number < 1) {
    alert("out of stock");
  }
  else{
    alert(elem.price);
    elem.number--;
    access("update collection set number=" + elem.number + " where id=" + elem.id, callcallBack);
  }
}

function callcallBack(json) {
  alert("Thank you!!!");
}

function queryCallBack() {
  var result = document.getElementById("results");

  while(result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

onload=go;
