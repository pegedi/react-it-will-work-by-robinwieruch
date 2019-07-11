import React, { Component } from 'react';
import update from 'immutability-helper';
import SimpleTable from './SimpleTable';
import Hello from './Hello';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import './style.css';



const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HITSPERPAGE = 'hitsPerPage='
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
    verticalAlign: '-35px',
  },
}));


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {result: null,
      name: 'React',
      searchTerm: DEFAULT_QUERY,
      hitsPerPage: 20,
    };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

/**
 * very important function
 * @param {string} searchTerm some search term
 * @param {number} page page number to fetch from the server
 * @param {number} hitsperPage hits per page
 */
  fetchSearchTopStories(searchTerm, page = 0, hitsPerPage = 20){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HITSPERPAGE}${hitsPerPage}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
  onSearchSubmit(event) {
    console.log("On Search Submit");
    event.preventDefault();
    const {searchTerm, hitsPerPage} = this.state;
    this.fetchSearchTopStories(searchTerm, 0, hitsPerPage);
  }

  setSearchTopStories (result) {
    console.log("setSearchTopStories:");
    console.log(result);
    const { hits, page, nbHits, nbPages, hitsPerPage } = result;
    const oldhits = page !==0 ? this.state.result.hits : [];
    const updatedHits = [...oldhits, ...hits] ;

    this.setState({result: { hits: updatedHits, page, nbHits, nbPages, hitsPerPage }});

    //this.setState({result});
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
    const page = (result && result.page) || 0;
    const nbPages = (result && result.nbPages) || 0;
    const hitsPerPage = this.state.hitsPerPage;
    console.log("App component / Render Method");
    console.log(result);

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
            { result && result.hits && <SimpleTable
                    list = {Object.assign(
                              {}, 
                              {headerRow: ["Title","Author","Comment Num","Points","Dismiss","Update"]},
                              {adat: result.hits},
                              {hitsPerPage},
                              )}
                    onDismiss ={this.onDismiss}
                    onUpdate ={this.onUpdate}
              />
              
            }
            <div className="interactions">
                <Button variant="contained" color="primary" onClick={() => this.fetchSearchTopStories(searchTerm, page + 1, hitsPerPage)}>
                  More
                </Button>
            </div>
         
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