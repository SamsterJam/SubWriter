

if(window.innerHeight/window.innerWidth > 1){
    var menu = document.getElementById("menu");
    menu.style="visibility:hidden; min-width:0px; width:0px;";
}



addEventListener("resize", (event) => {
    if(window.innerHeight/window.innerWidth > 1){
        var menu = document.getElementById("menu");
        menu.style="visibility:hidden; min-width:0px; width:0px;";
    }else{
        var menu = document.getElementById("menu");
        menu.style="visibility:visable; min-width:200px; width:200px;";
    }
});









function clearGhostText(){
    document.getElementById("ghost-text").value='';
}


document.getElementById('prompt').addEventListener('keydown', function(e) {
	if(e.code == 'Enter' && e.ctrlKey) {
		apiCallTestSubmit()
	}
});


//Temerature Slider
var slider1 = document.getElementById("temperature-selection");
var output1  = document.getElementById("selected-temp-value");
output1.innerHTML = slider1.value;
slider1.oninput = function() {
    output1.innerHTML = slider1.value;
}

//Length Slider
var slider2 = document.getElementById("length-selection");
var output2  = document.getElementById("selected-length-value");
output2.innerHTML = slider2.value;
slider2.oninput = function() {
    output2.innerHTML = slider2.value;
}

//Freq Slider
var slider3 = document.getElementById("frequency-selection");
var output3  = document.getElementById("selected-frequency-value");
output3.innerHTML = slider3.value;
slider3.oninput = function() {
    output3.innerHTML = slider3.value;
}

//Pres Slider
var slider4 = document.getElementById("presence-selection");
var output4  = document.getElementById("selected-presence-value");
output4.innerHTML = slider4.value;
slider4.oninput = function() {
    output4.innerHTML = slider4.value;
}



function hideKey(){
    document.getElementById("API-Key").type="password";
}

function showKey(){
    document.getElementById("API-Key").type="text";
}

function apiCallTestSubmit(){
    document.getElementById("prompt").disabled = true;
    document.getElementById("prompt").style="background-color: #1d1e23;";
    document.getElementsByClassName("loader")[0].style="visibility: visible";
    var button = document.getElementById("submit-button");
    button.disabled = true;
    button.style="background: linear-gradient(174deg, #6c56b3 0%, #483683 100%);";

    
    // Get the values of the input fields
    var model = document.getElementById("model-selection");
    var modelChoice = model.options[model.selectedIndex].text

    var temp = document.getElementById("temperature-selection").value;
    var length = document.getElementById("length-selection").value;
    var frequency = document.getElementById("frequency-selection").value;
    var presence = document.getElementById("presence-selection").value;
    var prompt = document.getElementById("prompt").value.toString();
    var apiKey = document.getElementById("API-Key").value.toString();
    // Get the values of the other input fields

    fetch('/apiCall', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "model": modelChoice, "prompt": prompt, "temperature": parseFloat(temp), "length": parseInt(length), "frequency": parseFloat(frequency), "presence": parseFloat(presence), "apiKey": apiKey})
    })
    .then(response => response.json())
    .then(response => updateWithData(response))
    

};


function updateWithData(response){
    if(response.choices[0].text == ''){
        document.getElementById("ghost-text").value = document.getElementById("prompt").value + ' [NO COMPLEATION]';
    }else if(response.choices[0].text == 'API-ERROR'){
        document.getElementById("ghost-text").value = document.getElementById("prompt").value + ' [API ERROR]';
    }else{
        document.getElementById("prompt").value += response.choices[0].text;
    }

    var prompt = document.getElementById("prompt");
    prompt.disabled = false;
    prompt.style="background-color: #2b2f38;";
    prompt.scrollTop = prompt.scrollHeight;

    document.getElementsByClassName("loader")[0].style="visibility: hidden";

    var button = document.getElementById("submit-button");
    button.disabled=false;
    button.style="background: linear-gradient(174deg, #9a7bfd 0%, #7558d2 100%);";
    
}









//keep API key
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
var keyInfo = parseQuery(query);

document.getElementById('API-Key').value = keyInfo.APIkeyid;