import React, { Component } from 'react';
import update from 'immutability-helper';

import Hello from './Hello';
import './style.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'Github',
    url: 'https://github.com/',
    author: 'Hyatt',
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {list: list,
      name: 'React',
      searchTerm: '',
    };

    this.setState({list: list});
    this.logo = "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";
    
    this.onDismiss = this.onDismiss.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }
  onDismiss(id) {
    console.log('Goodbye onDismiss ' + id);
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }
  onUpdate(id) {
    console.log('Hello onUpdate ' + id);
    const isNotId = item => item.objectID !== id;
    const indexnum = this.state.list.findIndex(e => e.objectID == id);
    this.setState(update(this.state, {list: {[indexnum]: {author: {$set: "Peti"}}}}));
  }
  onSearchChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <Hello name={this.state.name} />
          <img src={this.logo} className="App-logo" alt="logo" />
          <p>            
            Start editing to see some magic happen :)
            <Search
              value = {searchTerm}
              onChange = {this.onSearchChange}
            >
              Keress csak
            </Search>
            <Table
              list = {this.state.list}
              pattern = {searchTerm}
              onDismiss ={this.onDismiss}
              onUpdate ={this.onUpdate}
            />
           
            {/*console.log(DisplayArray(list))*/}
          </p>
          <p>
             Edit <code>App.js</code> and save to reload. Actually no save needed....
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

const Search = ({value, onChange, children}) => {
  //do something here
  return (
    <form>
      {children}
      <input
        type = "text"
        value = {value}
        onChange = {onChange}
      />
    </form>
  );
}
const Table = ({list, pattern, onDismiss, onUpdate}) => {
  //some code or action go here
  return(
    list.filter(item => item.title.toLowerCase().includes(pattern)).map(item => {
      return (
        <div key={item.objectID}> 
          <span> <a href={item.url}> {item.title} </a></span>
          <span> {item.author} </span>
          <span> {item.num_comments} </span>
          <span> {item.points} </span>
          <span>
            <Button 
              onClick={() => onDismiss(item.objectID)}
              className = ''
             >
              Dismiss
             </Button>
            <Button
              onClick = {() => onUpdate(item.objectID)}
             >
              PETI
             </Button>
            </span>
         </div>
       );
     }
     )
  );
}
const Button = ({onClick,className = '', children}) => {
  //your code goes here
  return(
    <button
      onClick = {onClick}
      className = {className}
      type = "button"
     >
      {children}
     </button>    
  );
}

export default App; 