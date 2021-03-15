import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
    ChangeSet,
    Column,
    EditingState,
    IntegratedPaging,
    PagingState,
    TableEditColumn as TableEditColumnBase
} from '@devexpress/dx-react-grid';
import {
    Grid,
    PagingPanel,
    Table,
    TableColumnResizing,
    TableEditColumn,
    TableHeaderRow,
    TableInlineCellEditing
} from '@devexpress/dx-react-grid-material-ui';
import axios from "axios";
import {CircularProgress} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import ProductForm from "./ProductForm";
import {Delete} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

export interface Product {
    id: number,
    name: string,
    available: number,
    description: string,
    categoryName: string
}

// @ts-ignore
const FocusableCell = ({onClick, ...restProps}) => (
    // @ts-ignore
    <Table.Cell {...restProps} tabIndex={0} onFocus={onClick}/>
);

export const productApi = axios.create({
    baseURL: "http://localhost:8080/api/products"
})


export default function Products() {
    const [rows, setRows] = useState<Product[]>([]);
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    // const [pageSize, setPageSize] = useState(3);

    const loadData = () => {
        console.log("started")
        setRefresh(false)
        if (!loading) {
            setLoading(true)
            productApi.get('')
                .then(res => {
                    console.log("succesful")
                    setRows(res.data)
                })
                .catch(() => console.log('Loading remote data was not successful'))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => loadData(), [refresh])

    const commitChanges = (changes: ChangeSet) => {
        let changed = changes.changed
        let deleted = changes.deleted
        console.log(deleted)

        if ((!changed || Object.values(changed).every(prop => prop === undefined)) &&
            (!deleted || Object.values(deleted).every(prop => prop === undefined))) {
            console.log("no changes")
            return
        }
        let requests = []
        if (changed) {
            requests.push(productApi.patch('', changed))
        }
        if (deleted) {
            for (const item of deleted) {
                console.log(item)
                requests.push(productApi.delete('/' + item))
            }
        }

        axios.all(requests).catch(reason => console.log(reason)).finally(() => setRefresh(true))


        // let changedRows: Product[];
        // if (changed) {
        //     // @ts-ignore
        //     changedRows = rows.map(row => (changed[row.id] ? {
        //
        //         // @ts-ignore
        //         ...row, ...changed[row.id]
        //     } : row));
        //
        // }
        // if (deleted) {
        //     const deletedSet = new Set(deleted);
        //     changedRows = rows.filter(row => !deletedSet.has(row.id));
        // }

        // @ts-ignore
        // setRows(changedRows);
    };

    const columns: Column[] = [
        {name: 'id', title: 'ID', getCellValue: row => (row.id)},
        {name: "name", title: "Product name", getCellValue: row => (row.name)},
        {name: 'available', title: 'In stock', getCellValue: row => (row.available)},
        {name: 'categoryName', title: 'Category', getCellValue: row => (row.category.name)}
    ];

    const [columnWidths] = useState([
        {columnName: 'id', width: '8%'},
        {columnName: 'name', width: '45%'},
        {columnName: 'available', width: '10%'},
        {columnName: 'categoryName', width: '30%'},
    ])

    const disabledColumns = [{columnName: 'id', editingEnabled: false}]
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const AddButton = (onExecute: () => void) => (
        <Fab color="primary" aria-label="add" size="small" onClick={handleClickOpen}>
            <AddIcon/>
        </Fab>
    )

    // @ts-ignore
    const DeleteButton = ({onExecute}) => (
        <IconButton
            onClick={() => {
                // eslint-disable-next-line
                if (window.confirm('Are you sure you want to delete this row?')) {
                    onExecute()
                    //productApi.delete('/').then(() => setRefresh(true)).catch(err => console.log(err))
                }
            }}
            title="Delete row"
        >
            <Delete/>
        </IconButton>
    );

    const commandComponents = {
        add: AddButton,
        delete: DeleteButton
    }

    const Command: React.ComponentType<TableEditColumnBase.CommandProps> = (commandProps) => {
        // @ts-ignore
        const CommandButton = commandComponents[commandProps.id]
        return (
            <CommandButton onExecute={commandProps.onExecute}/>
        )
    }
    return (
        <Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create new product</DialogTitle>
                <DialogContent>
                    <ProductForm executeAfterSubmit={() => {
                        setOpen(false)
                        setRefresh(true)
                    }}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid
                rows={rows}
                columns={columns}
                getRowId={row => row.id}
            >
                <EditingState
                    onCommitChanges={commitChanges}
                    columnExtensions={disabledColumns}
                />
                <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={7}
                />
                <IntegratedPaging/>
                {/* @ts-ignore*/}
                <Table cellComponent={FocusableCell}/>
                <TableColumnResizing defaultColumnWidths={columnWidths} resizingMode="nextColumn"/>
                <TableHeaderRow/>
                <TableInlineCellEditing/>
                <TableEditColumn
                    showAddCommand={!open}
                    showDeleteCommand
                    commandComponent={Command}
                    width='7%'
                />
                <PagingPanel/>
            </Grid>
            {loading && <CircularProgress/>}

        </Paper>
    );
}
