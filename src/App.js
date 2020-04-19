import React from 'react';
import './App.css';

// GitHub usernames: gaearon, sophiebits, sebmarkbage, bvaughn
const Heading = ({title}) => {
  return (
    <header className="header">{title} Batman</header>
  );
};

const Input = (props) => (
    <React.Fragment>
      <form onSubmit={props.onSubmit}>
      <input placeholder="Github Username" value={props.value} onChange={props.onChange}/>
      <input type="submit" value="Add a card" />
      </form>
    </React.Fragment>
);

const Search = (props) => (
      <div className="container-fluid">
        <Input value={props.value} onChange={props.onChange} onClick={props.onClick} onSubmit={props.onSubmit} />
      </div>
);

const Card = (props) => (
    <div className="github-profile">
      <img  alt="Github avatar" src={props.src} />
      <div className="info">
        <div className="name" style={{fontSize:'125%', textDecoration:'underline'}}> {props.fullName} </div>
        <div className="company">{props.org === null ? '': props.org}</div>
      </div>
    </div>
);

const CardList = (props) => (
     <div className="container-fluid">
      {props.cardsData.map(cardData => <Card key={cardData.id} {...cardData} />)}
     </div>
);

const App = () => {  
  const [value, updateValue] = React.useState("");
  const [cardsData, updateCardsData] = React.useState([]);
  
  const handleChange = (event) => {
    updateValue(event.target.value);
  }
  
  const search = (array, userName) => {
     for (let pos in array) {
       if (array[pos].userName === userName) {
          return pos;
       }
     }
    return -1;
  }
  
  const addData = async (userName, action) => {
     const pos = search(cardsData, userName);
     if (pos === -1) {
      // You can also use axios.get instead of fetch, in that case you need to use response.data instead of response.json
      const response = await fetch(`https://api.github.com/users/${userName}`);
      if (response.status === 200) {
        // const {avatar_url, name, company, id} = await response.json();
        const {avatar_url, name, company, id} = await response.json();
        const data = {
          userName: userName,
          src: avatar_url,
          fullName: name,
          org: company,
          id: id
        };
        updateCardsData(cardsData => cardsData.concat(data));
       }
     }
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    addData(value);
  }
  
  return (
    <div>
      <Heading title="The GitHub Cards App" />
      <Search value={value} onChange={handleChange} onSubmit={handleSubmit} />
      <CardList cardsData={cardsData} />
    </div> 
  );
}

export default App;
