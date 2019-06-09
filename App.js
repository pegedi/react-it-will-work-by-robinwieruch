import React, { Component } from 'react';
import update from 'immutability-helper';
import SimpleTable from './SimpleTable';
import Hello from './Hello';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import './style.css';



const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
  button: {
    verticalAlign: '-35px'
  },
}));


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {result: null,
      name: 'React',
      searchTerm: DEFAULT_QUERY,
    };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }
  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
  onSearchSubmit(event) {
    console.log("On Search Submit");
    event.preventDefault();
    const {searchTerm} = this.state;
    console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`);
    this.fetchSearchTopStories(searchTerm);
  }

  setSearchTopStories (result) {
    this.setState({result});
   // console.log(result);
  }

  onDismiss(id) {
    console.log('Goodbye onDismiss, ID:  ' + id);
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: Object.assign({},this.state.result, {hits: updatedList}) 
    });
  }

  onUpdate(id) {
    console.log('Hello onUpdate ' + id);
    const isNotId = item => item.objectID !== id;
    const indexnum = this.state.result.hits.findIndex(e => e.objectID === id);
    this.setState(update(this.state, {result: {hits: {[indexnum]: {author: {$set: "Peti"}}}}}));
  }
  onSearchChange(e) {
   //console.log(e.target.value);
    this.setState({searchTerm: e.target.value});
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    console.log("component mount");
    this.fetchSearchTopStories(searchTerm);

  }
  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Hello name={this.state.name} />
          <p>            
            Start editing to see some magic happen :)
          </p>
            <Search
              value = {searchTerm}
              onChange = {this.onSearchChange}
              onSubmit = {this.onSearchSubmit}
            >
              Search
            </Search>
            { result
              ? <SimpleTable
                list = {Object.assign(
                          {}, 
                          {headerRow: ["Title","Author","Comment Num","Points","Dismiss","Update"]},
                          {adat: result.hits})}
                onDismiss ={this.onDismiss}
                onUpdate ={this.onUpdate}
              />
              : null
            }
            {/*console.log(DisplayArray(list))*/}
         
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
        </div>
      </div>
    );
  }
}

const Search = ({value, onChange, onSubmit, children}) => {
  //do something here
  const logo = "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";
  const classes = useStyles();

  return (
    <form onSubmit = {onSubmit}>
       <TextField
        id="outlined-search"
        label="Search field"
        type="search"
        className={classes.textField}
        margin="normal"
        variant="outlined"
        value={value}
        onChange = {onChange}
      />

      
 
      <Button variant="contained" color="primary" type = "submit" className={classes.button}>
        {children}
        <img src={logo} className="App-logo" alt="logo" />
      </Button>
    </form>
  );
}


export default App; 