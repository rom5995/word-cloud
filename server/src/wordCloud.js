const axios = require('axios');
const {JSDOM} = require('jsdom');

const CLASS_NAMER_URL = 'https://www.classnamer.org/';
const WORDS_COUNT = 100;
const WORDS_FROM_CLASS_NAMER = 3;

async function getWordsFromClassNamer() {
    try {
        const {data} = await axios.get(CLASS_NAMER_URL);
        const dom = new JSDOM(data);
        const classes = dom.window.document.querySelector("p").textContent;

        return classes.split(/(?=[A-Z])/);
    } catch (error) {
        console.log('error', error);
    }
}

function duplicateFunctionsToArray(func, amount) {
    const requests = [];
    for (let i = 0; i < amount; i++) {
        requests.push(func());
    }

    return requests;
}

exports.getWordCloud = async function() {
    const requests = duplicateFunctionsToArray(getWordsFromClassNamer, WORDS_COUNT / WORDS_FROM_CLASS_NAMER);

    let data = (await Promise.all(requests)).flat(1);

    while(data.length < WORDS_COUNT) {
        const amountOfMissingRequest = Math.ceil((WORDS_COUNT - data.length) / WORDS_FROM_CLASS_NAMER);
        const requestsOfMissing = duplicateFunctionsToArray(getWordsFromClassNamer, amountOfMissingRequest);

        data = data.concat((await Promise.all(requestsOfMissing)).flat(1));
    }

    if (data.length > WORDS_COUNT) {
       data = data.slice(0, WORDS_COUNT - data.length); 
    }

    return data;
}