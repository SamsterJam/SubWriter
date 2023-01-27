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

var apiKey = queryData.key;
var temp = (queryData.temp != undefined)? queryData.temp : 0.3;
var length = (queryData.len != undefined)? queryData.len : 100;
var frequency = (queryData.freq != undefined)? queryData.freq : 1.5;





function clearGhostText(){
    document.getElementById("ghost-text").value='';
    document.getElementById("ghost-text").style.opacity = 0.5;
}


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

    //Disable prompt
    var promptText = document.getElementById("prompt");
    promptText.disabled = true;
    promptText.style="background-color: #17171a;"
    prompt = promptText.value;

    //set color of loader to random
    var loadColors = ['#98c379', '#61afef', '#c678dd', '#de6a73', '#d19a66'];
    var random_color = loadColors[Math.floor(Math.random() * loadColors.length)];
    var loader = document.getElementsByClassName("loader")[0];
    loader.firstElementChild.style.background = random_color;


    document.getElementsByClassName("loader")[0].style="visibility: visible";

    fetch('/apiCall', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "model": 'text-davinci-003', "prompt": prompt, "temperature": parseFloat(temp), "length": parseInt(length), "frequency": parseFloat(frequency), "presence": parseFloat(frequency), "apiKey": apiKey})
    })
    .then(response => response.json())
    .then(response => updateWithData(response))
    

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
    promptObj.style="background-color: #202124;";
    prompt.scrollTop = prompt.scrollHeight;

    document.getElementsByClassName("loader")[0].style="visibility: hidden";
    
}









