import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import TableFooter from '@material-ui/core/TableFooter';

const useStyles = makeStyles(theme => ({
    root: {
 //     width: '100%',
      width: 'auto', 
      display: 'table',
      marginTop: theme.spacing(3),
 //     overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
    head: {
      backgroundColor: "lightgrey",
      position: "sticky",
      top: "0px",
      zIndex: '10',
    },
    button: {
    },
  })
);

function SimpleTable({list, onDismiss, onUpdate, onLengthUpdate, enablePagination, onAdditionSubmit}) {
    const classes = useStyles();
    console.log("SimpleTable renders:");
    console.log(list);

    function displayLabel(props) {
      return (
        `helló ${list.adat.length} lines of total ${list.nbHits}`
      );
    }

    function TablePaginationActions(props) {
      const classes = useStyles1();
      const theme = useTheme();
      const { page, hitsPerPage } = props;
      console.log("function TablePaginationActions");

      return (
        <div className={classes.root}>
          <IconButton onClick = {onAdditionSubmit} disabled={!enablePagination}
            aria-label="Next"
          >
            <KeyboardArrowDown />
          </IconButton>
        </div>
      );
    }

    TablePaginationActions.propTypes = {
      count: PropTypes.number.isRequired,
      page: PropTypes.number.isRequired,
      rowsPerPage: PropTypes.number.isRequired,
    };

    return (
       <Paper className={classes.root}>
            <Table className = {classes.table}>
                <TableHead>
                    <TableRow key="-1">
                        {list.headerRow.map( (field, index) => (
                            <TableCell key={"headerCell" + index} className={classes.head}>{field}</TableCell>
                        ))}

                    </TableRow>
                </TableHead>
                <TableBody>
                    
                    {list.adat.map((row, indexx) => (
                        <TableRow key={row.objectID} hover>
                            <TableCell><a href={row.url}> {indexx + " " + row.title} </a> </TableCell>
                            <TableCell>{row.author}</TableCell>
                            <TableCell>{row.num_comments}</TableCell>
                            <TableCell>{row.points}</TableCell>
                            <TableCell>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => onDismiss(row.objectID)}
                                    className = ''
                                    key = {row.objectID + "button1"}>
                                    Dismiss
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => onUpdate(row.objectID)}
                                    className = ''
                                    key = {row.objectID + "button2"}>
                                    Peti
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter key="-3">
                  <TableRow key= "-2">
                    
                       <MyTablePagination
                          rowsPerPageOptions={[10, 20, 40, 80]}
                          downLoadLength={list.downLoadLength}
                          labelRowsPerPage = 'Download Length'
                          count={list.nbHits}
                          page={0}
                          SelectProps={{
                            inputProps: { 'aria-label': 'Hits per page' },
                            native: true,
                            }}
                          ActionsComponent={TablePaginationActions}
                          labelDisplayedRows = {displayLabel}
                          onLengthUpdate = {onLengthUpdate}
                          enablePagination = {list.adat.length < list.nbHits}
                        />
                    </TableRow>
                 </TableFooter>
            
          </Table>
        </Paper>
       
    );
}

export default SimpleTable;

/**
 * pagination function
 */
const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
    textAlign: "center",
  },
}));
function paginationLabel(props) {
  console.log("PaginationLabel func");
  console.log(props)
  return(
    `${props.to} lines of total ${props.count}`
  )
} 

function MyTablePagination(props) {
  const [downLoadLength, setDownLoadLength] = useState(props.downLoadLength);
  
  /**
   * required function per propTypes
   * custom log can be added
   */
  function handleChangePage(event, pageNum) {   
  }

  function handleChangeRowsPerPage(event){
    props.onLengthUpdate(event.target.value);
    setDownLoadLength(parseInt(event.target.value,10));
  }
  return (
    <TablePagination
        rowsPerPageOptions={props.rowsPerPageOptions}
        rowsPerPage={downLoadLength}
        labelRowsPerPage = {props.labelRowsPerPage}
        count={props.count}
        page={0}
        SelectProps={{
          inputProps: { 'aria-label': 'Hits per page' },
          native: true,
          }}
        ActionsComponent={props.ActionsComponent}
        labelDisplayedRows = {props.labelDisplayedRows}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onChangePage={handleChangePage}
      />
  )
}
