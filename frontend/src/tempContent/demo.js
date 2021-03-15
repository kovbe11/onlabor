import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {Plugin, Template, TemplateConnector, TemplatePlaceholder,} from '@devexpress/dx-react-core';
import {EditingState} from '@devexpress/dx-react-grid';
import {Grid, Table, TableEditColumn, TableHeaderRow,} from '@devexpress/dx-react-grid-material-ui';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiGrid from '@material-ui/core/Grid';


/* eslint-disable no-shadow */
const Popup = ({
                   onChange,
                   onApplyChanges,
                   onCancelChanges,
                   open,
               }) => (
    <Dialog open={open} onClose={onCancelChanges} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Employee Details</DialogTitle>
        <DialogContent>
            <MuiGrid container spacing={3}>
                <MuiGrid item xs={6}>
                    <FormGroup>
                        <TextField
                            margin="normal"
                            name="firstName"
                            label="First Name"
                            value={''}
                            onChange={onChange}
                        />
                        <TextField
                            margin="normal"
                            name="prefix"
                            label="Title"
                            value={''}
                            onChange={onChange}
                        />
                        <TextField
                            margin="normal"
                            name="position"
                            label="Position"
                            value={''}
                            onChange={onChange}
                        />
                    </FormGroup>
                </MuiGrid>
                <MuiGrid item xs={6}>
                    <FormGroup>
                        <TextField
                            margin="normal"
                            name="lastName"
                            label="Last Name"
                            value={''}
                            onChange={onChange}
                        />
                        <TextField
                            margin="normal"
                            name="phone"
                            label="Phone"
                            value={''}
                            onChange={onChange}
                        />
                    </FormGroup>
                </MuiGrid>
            </MuiGrid>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancelChanges} color="primary">
                Cancel
            </Button>
            <Button onClick={onApplyChanges} color="primary">
                Save
            </Button>
        </DialogActions>
    </Dialog>
);

const PopupEditing = React.memo(({ popupComponent: Popup }) => (
    <Plugin>
        <Template name="popupEditing">
            <TemplateConnector>
                {(
                    {
                        rows,
                        getRowId,
                        addedRows,
                        createRowChange
                    },
                    {
                        changeAddedRow, commitAddedRows, cancelAddedRows,
                    },
                ) => {
                    const isNew = addedRows.length > 0;
                    let editedRow;
                    let rowId;
                    if (isNew) {
                        rowId = 0;
                        editedRow = addedRows[rowId];
                    }

                    const processValueChange = ({ target: { name, value } }) => {
                        const changeArgs = {
                            rowId,
                            change: createRowChange(editedRow, value, name),
                        };
                        if (isNew) {
                            changeAddedRow(changeArgs);
                        }
                    };
                    const rowIds = [0];
                    const applyChanges = () => {
                        if (isNew) {
                            commitAddedRows({ rowIds });
                        }
                    };
                    const cancelChanges = () => {
                        if (isNew) {
                            cancelAddedRows({ rowIds });
                        }
                    };

                    return (
                        <Popup
                            open={isNew}
                            row={editedRow}
                            onChange={processValueChange}
                            onApplyChanges={applyChanges}
                            onCancelChanges={cancelChanges}
                        />
                    );
                }}
            </TemplateConnector>
        </Template>
        <Template name="root">
            <TemplatePlaceholder />
            <TemplatePlaceholder name="popupEditing" />
        </Template>
    </Plugin>
));

const getRowId = row => row.id;
export default () => {
    const [columns] = useState([
        { name: 'firstName', title: 'First Name' },
        { name: 'lastName', title: 'Last Name' },
        { name: 'position', title: 'Position' },
        { name: 'phone', title: 'Phone' },
    ]);
    const [rows, setRows] = useState([]);

    const commitChanges = ({ added, changed }) => {
        let changedRows;
        if (added) {
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            changedRows = [
                ...rows,
                ...added.map((row, index) => ({
                    id: startingAddedId + index,
                    ...row,
                })),
            ];
        }
        if (changed) {
            changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        }
        setRows(changedRows);
    };

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
            >
                <EditingState
                    onCommitChanges={commitChanges}
                />
                <Table />
                <TableHeaderRow />
                <TableEditColumn
                    showAddCommand
                    showEditCommand
                />
                <PopupEditing popupComponent={Popup} />
            </Grid>
        </Paper>
    );
};