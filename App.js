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
      result: null,
      name: 'React',
      deletedLines: 0,
      enablePagination: false,
    };

    this.downLoadLength= 20;
    this.offset = 0;
    this.actualSearchTerm = '';
    this.enteredSearchTerm = DEFAULT_QUERY,

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onLengthUpdate = this.onLengthUpdate.bind(this);
    this.onAdditionSubmit = this.onAdditionSubmit.bind(this);
  }

/**
 * very important function
 * @param {string} searchTerm some search term
 * @param {number} page page number to fetch from the server
 * @param {number} hitsperPage hits per page
 */
  fetchSearchTopStories(searchTerm, pOffset = 0, downLoadLength = 20){
    console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_OFFSET}${pOffset}&${PARAM_LENGTH}${downLoadLength}`);

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_OFFSET}${pOffset}&${PARAM_LENGTH}${downLoadLength}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
  onSearchSubmit(pSearchString) {
    console.log("On Search Submit");
    
    //console.log(event);
    this.enteredSearchTerm = pSearchString;
    if (pSearchString !== this.actualSearchTerm) {
      this.actualSearchTerm = pSearchString;
      this.fetchSearchTopStories(pSearchString, 0, this.downLoadLength);
    } 
  }
  onAdditionSubmit() {
    this.fetchSearchTopStories(this.actualSearchTerm, this.state.result.hits.length + this.state.deletedLines, this.downLoadLength);
  }

  setSearchTopStories (result) {
    console.log("setSearchTopStories:");
    console.log(result);
    console.log(this.actualSearchTerm);
    console.log(this.enteredSearchTerm);

    const { hits, offset, nbHits, length } = result;
    const oldhits = offset !==0 ? this.state.result.hits : [];
    const deletedLines = offset ==0 ? 0 : this.state.deletedLines;
    console.log(hits);
    const updatedHits = [...oldhits, ...hits] ;
    const count = updatedHits.length;
    const enablePagination = count < nbHits;
    this.setState({result: { hits: updatedHits, offset, nbHits,  count},
                   deletedLines,
                   enablePagination,
                   });

    //this.setState({result});
   // console.log(result);
  }

  onDismiss(id) {
    console.log('Goodbye onDismiss, ID:  ' + id);
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: Object.assign({},this.state.result, {hits: updatedList}),
      deletedLines: this.state.deletedLines + 1,
      count: this.state.count - 1, 
    });
  }
  
  /**
   * updates length property
   */
  onLengthUpdate(updatedDownLoadLength){
    console.log("function: onLengthUpdate changed download length from "+this.downLoadLength+" to "+updatedDownLoadLength);
    this.downLoadLength = updatedDownLoadLength;
  }
  
  onUpdate(id) {
    console.log('Hello onUpdate ' + id);
    const isNotId = item => item.objectID !== id;
    const indexnum = this.state.result.hits.findIndex(e => e.objectID === id);
    this.setState(update(this.state, {result: {hits: {[indexnum]: {author: {$set: "Peti"}}}}}));
  }
 
  componentDidMount() {
    console.log("component mount");

    const { searchTerm } = this.state;
    if (searchTerm !== this.actualSearchTerm) {
      this.actualSearchTerm = searchTerm;
      this.fetchSearchTopStories(searchTerm);
    }
  }
  render() {
    const {result } = this.state;
    const searchTerm = this.enteredSearchTerm;
    const page = (result && result.page) || 0;
    const nbPages = (result && result.nbPages) || 0;
    const downLoadLength = this.downLoadLength;
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