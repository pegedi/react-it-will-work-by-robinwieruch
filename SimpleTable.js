import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';

import TableFooter from '@material-ui/core/TableFooter';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  })
);

function SimpleTable({list, onDismiss, onUpdate}) {
    const classes = useStyles();
    
    return (
        <Paper className={classes.root}>
            <Table className = {classes.table}>
                <TableHead>
                    <TableRow key="-1">
                        {list.headerRow.map( field => (
                            <TableCell>{field}</TableCell>
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
                <TableFooter>
                  <TableRow>
                    Valami
                  </TableRow>
                 </TableFooter>
            </Table>
        </Paper>
    );
}

export default SimpleTable;