import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import ReactWordcloud from 'react-wordcloud';

const SERVER_URL = 'https://uawtlfi0a8.execute-api.us-east-1.amazonaws.com/Prod/wordcloud';

function App() {
  const [words, setWords] = useState();
  const [loading, setLoading] = useState(true);

  const getWords = async () => {
    try {
      const {data} = await axios(SERVER_URL);

      const wordsForComponent = data.map(word => ({
        text: word,
        value: Math.floor(Math.random() * 30) + 1
      }));
      
      setWords(wordsForComponent);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getWords();
  }, []);

  return (
    <div className="App">
      {(loading)? <h1>Loading...</h1> : <ReactWordcloud words={words} />}
    </div>
  );
}

export default App;
