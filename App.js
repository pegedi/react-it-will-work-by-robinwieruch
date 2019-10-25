import React, {Component, useState} from 'react';
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


//Check out that: query: https://www.algolia.com/doc/api-reference/api-parameters/offset/

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HITSPERPAGE = 'hitsPerPage=';
const PARAM_OFFSET = 'offset=';
const PARAM_LENGTH = 'length=';
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

/**
 * call App represent the table
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {},
      searchKey: '',
      name: 'React',
      deletedLines: 0,
      enablePagination: false,
    };

    this.downLoadLength= 20;
    this.offset = 0;
    this.actualSearchTerm = DEFAULT_QUERY;
    this.enteredSearchTerm = DEFAULT_QUERY,

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onLengthUpdate = this.onLengthUpdate.bind(this);
    this.onAdditionSubmit = this.onAdditionSubmit.bind(this);

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

/**
 * very important function
 * @param {string} searchTerm some search term
 * @param {number} page page number to fetch from the server
 * @param {number} hitsperPage hits per page
 */
  fetchSearchTopStories(searchTerm, pOffset = 0, downLoadLength = 20){
    console.log('--fetchSearchTopStories:');
    console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_OFFSET}${pOffset}&${PARAM_LENGTH}${downLoadLength}`);

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_OFFSET}${pOffset}&${PARAM_LENGTH}${downLoadLength}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
  onSearchSubmit(pSearchString) {
    console.log('--onSearchSubmit:');
    console.log('pSearchString = ' + pSearchString);
    console.log('actualSearchTerm = ' + this.actualSearchTerm);

    //console.log(event);
    this.enteredSearchTerm = pSearchString;
    if (pSearchString !== this.actualSearchTerm) {
      this.actualSearchTerm = pSearchString;
      this.setState({searchKey: pSearchString});
      if (this.needsToSearchTopStories(pSearchString)) {
        this.fetchSearchTopStories(pSearchString, 0, this.downLoadLength);
      }
    } 
  }
  needsToSearchTopStories(searchTerm) {
    console.log('--needsToSearchTopStories: searchTerm=' + searchTerm);
    return !this.state.results[searchTerm];
  }

  onAdditionSubmit() {
    const {searchKey} = this.state; 
    this.fetchSearchTopStories(searchKey, this.state.results[searchKey].hits.length + 
                                                      this.state.results[searchKey].deletedLines, this.downLoadLength);
  }

  setSearchTopStories (result) {
    console.log("--setSearchTopStories:");
    console.log(result);
    console.log(this.actualSearchTerm);
    console.log(this.state.searchKey);
    //console.log(this.enteredSearchTerm);

    const { hits, offset, nbHits, length } = result;
    const {searchKey, results} = this.state;
    const oldhits = offset !==0 ? this.state.results[searchKey].hits : [];
    const deletedLines = offset ==0 ? 0 : this.state.results[searchKey].deletedLines;
    console.log(hits);
    const updatedHits = [...oldhits, ...hits] ;
    const count = updatedHits.length;
    const enablePagination = count < nbHits;
    this.setState({results: { ...results,
                              [searchKey]: {hits: updatedHits, offset, nbHits,  count, deletedLines}},
                   enablePagination,
                   });

    //this.setState({result});
    console.log(this.state);
  }

  onDismiss(id) {
    console.log('--onDismiss:');
    const isNotId = item => item.objectID !== id;
    const {searchKey, results} = this.state;
    const updatedList = this.state.results[searchKey].hits.filter(isNotId);
    const updatedDeletedLines = this.state.results[searchKey].deletedLines + 1
    const updatedCount = this.state.results[searchKey].count - 1
    this.setState({ 
      results: { ...results,
                 [searchKey]: {hits: updatedList, 
                               deletedLines: updatedDeletedLines,
                               count: updatedCount}},
    });
  }
  
  /**
   * updates length property
   */
  onLengthUpdate(updatedDownLoadLength){
    console.log('--onLengthUpdate:');
    console.log("function: onLengthUpdate changed download length from "+this.downLoadLength+" to "+updatedDownLoadLength);
    this.downLoadLength = updatedDownLoadLength;
  }
  
  onUpdate(id) {
    console.log('--onUpdate: id= ' + id);
    const isNotId = item => item.objectID !== id;
    const {searchKey} = this.state;
    const indexnum = this.state.results[searchKey].hits.findIndex(e => e.objectID === id);

    this.setState(update(this.state, {results: { [searchKey]: {hits: {[indexnum]: {author: {$set: "Peti"}}}}}}));
    
  }
 
  componentDidMount() {
    console.log("--componentDidMount:");

    const { searchKey } = this.state;
    if (searchKey !== this.actualSearchTerm) {
      this.setState({searchKey: this.actualSearchTerm});
     
      this.fetchSearchTopStories(searchKey);
    }
  }
  render() {
    const searchKey = this.actualSearchTerm;
    const result = this.state.results[searchKey];
    const searchTerm = this.enteredSearchTerm;
    const page = (result && result.page) || 0;
    const nbPages = (result && result.nbPages) || 0;
    const downLoadLength = this.downLoadLength;
    console.log("--App.render Method:");
    console.log("searchKey = " + searchKey)
    console.log(result);

    console.log(this.state);

    return (
      <div className="page">
        <div className="interactions">
          <Hello name={this.state.name} />
          <p>            
            Start editing to see some magic happen :)
          </p>
            <Search
              value = {searchKey}
              
              onSubmit = {this.onSearchSubmit}
            >
              Search
            </Search>
            { result && result.hits && <SimpleTable
                    list = {Object.assign(
                              {}, 
                              {headerRow: ["Title","Author","Comment Num","Points","Dismiss","Update"]},
                              {adat: result.hits},
                              {downLoadLength},
                              {nbHits: result.nbHits},
                              {count: result.count},
                              )}
                    onDismiss ={this.onDismiss}
                    onUpdate ={this.onUpdate}
                    onLengthUpdate = {this.onLengthUpdate}
                    enablePagination = {this.state.enablePagination}
                    onAdditionSubmit = {this.onAdditionSubmit}
              />
              
            }
            
         
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

/**
 * search section
 */
const Search = ({value, onSubmit, children}) => {
  //do something here
  const logo = "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";
  const classes = useStyles();
  const [searchString, setSearchString] = useState(value);
  
  function searchFieldChange(e){
    setSearchString(e.target.value);
  }
  
  function searchFieldSubmit(e) {

    e.preventDefault();
    onSubmit(searchString);
  }

  return (
    <form onSubmit = {searchFieldSubmit}>
       <TextField
        id="outlined-search"
        label="Search field"
        type="search"
        className={classes.textField}
        margin="normal"
        variant="outlined"
        value={searchString}
        onChange = {searchFieldChange}
      />

      
 
      <Button variant="contained" color="primary" type = "submit" className={classes.button}>
        {children}
        <img src={logo} className="App-logo" alt="logo" />
      </Button>
    </form>
  );
}


export default App; 