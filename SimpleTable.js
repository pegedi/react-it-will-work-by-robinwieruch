import React from 'react';
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
      width: '100%',
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

function SimpleTable({list, onDismiss, onUpdate}) {
    const classes = useStyles();
    console.log("SimpleTable renders:");
    console.log(list);

    function displayLabel(props) {
      return (
        `helló ${list.adat.length} lines of total ${list.nbHits}`
      );
    }
    return (
       <Paper className={classes.root}>
            <Table className = {classes.table}>
                <TableHead>
                    <TableRow key="-1">
                        {list.headerRow.map( field => (
                            <TableCell className={classes.head}>{field}</TableCell>
                        ))}

                    </TableRow>
                </TableHead>
                <TableBody>
                    
                    {list.adat.map(row => (
                        <TableRow key={row.objectID} hover>
                            <TableCell><a href={row.url}> {row.title} </a> </TableCell>
                            <TableCell>{row.author}</TableCell>
                            <TableCell>{row.num_comments}</TableCell>
                            <TableCell>{row.points}</TableCell>
                            <TableCell>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => onDismiss(row.objectID)}
                                    className = ''>
                                    Dismiss
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => onUpdate(row.objectID)}
                                    className = ''>
                                    Peti
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter key="-3">
                  <TableRow key= "-2">
                    
                       <TablePagination
                          rowsPerPageOptions={[10, 20, 40, 80]}
                          rowsPerPage={list.hitsPerPage}
                          count={list.nbHits}
                          page={0}
                          SelectProps={{
                            inputProps: { 'aria-label': 'Hits per page' },
                            native: true,
                            }}
                          ActionsComponent={TablePaginationActions}
                          labelDisplayedRows = {displayLabel}
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

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { page, nbHits, hitsPerPage, onChangePage } = props;
  return (
    <div className={classes.root}>
      <IconButton
         
        
        aria-label="Next"
      >
        <KeyboardArrowDown />
      </IconButton>
    </div>
  );

}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
