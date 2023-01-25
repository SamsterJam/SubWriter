//Imports
const { response } = require('express');
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const app = express();      
const port = 8000;


//Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {        
    res.sendFile(__dirname + '/views/index.html');
    console.log('sending index.html');
});


//Listen on Port
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});


async function callAPI(request, response, next){
    try{
        console.log('Sending API request...');

        const parameters = request.body;

        //Set up for APICall
        const configuration = new Configuration({
            apiKey: parameters.apiKey,
        });

        const openai = new OpenAIApi(configuration);

        const APIresponse = await openai.createCompletion({
            model: parameters.model,
            prompt: parameters.prompt,
            temperature: parameters.temperature,
            max_tokens: parameters.length,
            top_p: 1,
            frequency_penalty: parameters.frequency,
            presence_penalty: parameters.presence,
        });



        //return the response
        var data = APIresponse.data;
        response.send(data);
        console.log('Sent back response!');
    }
    catch(e){
        console.log('error response');
        var errorData = ({choices: [({'text': 'API-ERROR'})]});
        response.send(errorData);
    }
}


app.post('/apiCall', callAPI);


