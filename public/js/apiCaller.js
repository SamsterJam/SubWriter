//Arguments
function parseQuery(str) {
    //Remove '?' from beginning.
    str = str.substring(1) 
    //split the string into key value pairs
    var pairs = str.split("&")
    //convert them into an object
    return pairs.reduce(function(map, pair) {
        var kv = pair.split("=")
        var key = kv[0]
        var value = kv[1]
        map[key] = value
        return map
    },{})
}


var query = window.location.search
var queryData = parseQuery(query);

// Set or Default
document.getElementById("API-Key").value = queryData.key;
document.getElementById("temperature-selection").value = (queryData.temp != undefined)? queryData.temp : 0.3;
document.getElementById("length-selection").value = (queryData.len != undefined)? queryData.len : 64;
document.getElementById("frequency-selection").value = (queryData.freq != undefined)? queryData.freq : 1;
document.getElementById("presence-selection").value = (queryData.pres != undefined)? queryData.pres : 1;
document.getElementById("model-selection").selectedIndex = (queryData.mod != undefined)? queryData.mod : 0;
document.getElementById("API-Key").value = (queryData.key != undefined)? queryData.key : "";




function clearGhostText(){
    document.getElementById("ghost-text").value='';
    document.getElementById("ghost-text").style.opacity = 0.5;
}


// Hide or Show button
document.getElementById("submitButton").style.visibility = (window.innerWidth < window.innerHeight)? "visible" : "hidden";
addEventListener("resize", (event) => {
    document.getElementById("submitButton").style.visibility = (window.innerWidth < window.innerHeight)? "visible" : "hidden";
});




document.getElementById('prompt').addEventListener('keydown', function(e) {
	if((e.code == 'Enter' && e.ctrlKey) || (e.code == 'Enter' && e.metaKey)) {
		apiCallTestSubmit()
	}
});


//make tabs work
document.getElementById('prompt').addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
  });


function hideKey(){
    document.getElementById("API-Key").type="password";
}

function showKey(){
    document.getElementById("API-Key").type="text";
}



function apiCallTestSubmit(){

    clearGhostText()
    if(document.getElementById("menu").style.visibility == "visible") toggleMenu()

    //Disable prompt
    var promptText = document.getElementById("prompt");
    promptText.disabled = true;
    document.body.style="background-color: #17171a;"
    prompt = promptText.value;

    //Disable Button
    document.getElementById("submitButton").disabled = "true";
    document.getElementById("submitButton").style.background = "#74905a";

    //set color of loader to random
    var loadColors = ['#70c1cc', '#cb83e6', '#78baf8', '#ebc885', '#a8cd84', "#e0727e"];
    var loader = document.getElementsByClassName("loader")[0];
    var bars = loader.children;
    var usedColors = [];
    for (let i = 0; i < bars.length; i++) {
        var random_color = loadColors[Math.floor(Math.random() * loadColors.length)];
        while (usedColors.includes(random_color)) {
            random_color = loadColors[Math.floor(Math.random() * loadColors.length)];
        } 
        bars[i].style.background = random_color;
        usedColors.push(random_color);
    }


    document.getElementsByClassName("loader")[0].style="visibility: visible";

    var model = document.getElementById("model-selection");
    var modelChoice = model.options[model.selectedIndex].text

    var temp = document.getElementById("temperature-selection").value;
    var length = document.getElementById("length-selection").value;
    var frequency = document.getElementById("frequency-selection").value;
    var presence = document.getElementById("presence-selection").value;
    var prompt = document.getElementById("prompt").value.toString();
    var apiKey = document.getElementById("API-Key").value.toString();

    fetch('/apiCall', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "model": modelChoice, "prompt": prompt, "temperature": parseFloat(temp), "length": parseInt(length), "frequency": parseFloat(frequency), "presence": parseFloat(presence), "apiKey": apiKey})
    })
    .then(response => response.json())
    .then(response => updateWithData(response));

};


function updateWithData(response){
    if(response.choices[0].text == ''){
        document.getElementById("ghost-text").value = document.getElementById("prompt").value+ ' [NO COMPLEATION]';
    }else if(response.choices[0].text == 'API-ERROR'){
        document.getElementById("ghost-text").value = document.getElementById("prompt").value + ' [API ERROR]';
    }else{
        document.getElementById("prompt").value += String(response.choices[0].text);
    }

    var promptObj = document.getElementById("prompt");
    promptObj.disabled = false;
    document.body.style="background-color: #202124;";
    promptObj.scrollTop = promptObj.scrollHeight;
    syncGhost();

    //Enable Button
    //Disable Button
    document.getElementById("submitButton").disabled = false;
    document.getElementById("submitButton").style.background = "#a8cd84";


    document.getElementsByClassName("loader")[0].style="visibility: hidden";
    
}



var menuViable = false;

function toggleMenu(){
    document.getElementById("menu").style.visibility = (menuViable)? "hidden" : "visible";
    //document.getElementById("settings").style.right = (menuViable)? "5px" : "205px";
    //document.getElementById("submitButton").style.right = (!menuViable)? ((window.innerHeight > 700)?  "205px" : "5px") : "5px";
    //document.getElementById("submitButton").style.visibility = (!menuViable)? "hidden" : "visible";
    document.getElementById("submitButton").style.right = (menuViable)? "5px" : "unset";
    document.getElementById("submitButton").style.left = (menuViable)? "unset" : "5px";
    document.getElementById("settings").style.fontWeight = (menuViable)? "400" : "600";


    menuViable = !menuViable;
}




function syncGhost(){
    document.getElementById("ghost-text").scrollTop = document.getElementById("prompt").scrollTop;
}



function hideKey(){
    document.getElementById("API-Key").type="password";
    updateBar("key", document.getElementById("API-Key").value);
}

function showKey(){
    document.getElementById("API-Key").type="text";
}

//Temerature Slider
var slider1 = document.getElementById("temperature-selection");
var output1  = document.getElementById("selected-temp-value");
output1.innerHTML = slider1.value;
slider1.oninput = function() {
    output1.innerHTML = slider1.value;
    updateBar("temp", document.getElementById("temperature-selection").value);
}

//Length Slider
var slider2 = document.getElementById("length-selection");
var output2  = document.getElementById("selected-length-value");
output2.innerHTML = slider2.value;
slider2.oninput = function() {
    output2.innerHTML = slider2.value;
    updateBar("len", document.getElementById("length-selection").value);
}

//Freq Slider
var slider3 = document.getElementById("frequency-selection");
var output3  = document.getElementById("selected-frequency-value");
output3.innerHTML = slider3.value;
slider3.oninput = function() {
    output3.innerHTML = slider3.value;
    updateBar("freq", document.getElementById("frequency-selection").value);
}

//Pres Slider
var slider4 = document.getElementById("presence-selection");
var output4  = document.getElementById("selected-presence-value");
output4.innerHTML = slider4.value;
slider4.oninput = function() {
    output4.innerHTML = slider4.value;
    updateBar("pres", document.getElementById("presence-selection").value);
}

function updateBar(val, newVal){
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search)
        searchParams.set(val, newVal);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
    }
}
