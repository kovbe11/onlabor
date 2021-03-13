import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
    ChangeSet,
    Column,
    CustomPaging,
    CustomSummary,
    EditingState,
    IntegratedPaging,
    PagingState
} from '@devexpress/dx-react-grid';
import {Grid, PagingPanel, Table, TableHeaderRow} from '@devexpress/dx-react-grid-material-ui';
import {Category} from "./Category"
import products from "../tempContent/products.json"


interface Product {
    id: number,
    name: string,
    available: number,
    description: string,
    category: Category
}

export default function Products() {
    const [rows, setRows] = useState<Product[]>(
        products
    );
    const [editingCells, setEditingCells] = useState();

    // const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    // const [pageSize, setPageSize] = useState(3);

    const commitChanges = (changes: ChangeSet) => {
        let changed = changes.changed
        let deleted = changes.deleted

        if (!changed && !deleted) {
            return
        }
        let changedRows: Product[];
        if (changed) {
            // @ts-ignore
            changedRows = rows.map(row => (changed[row.id] ? {...row, ...changed[row.id]} : row));
        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = rows.filter(row => !deletedSet.has(row.id));
        }

        // @ts-ignore
        setRows(changedRows);
    };

    const columns: Column[] = [
        {name: 'id', title: 'Name', getCellValue: row => (row.id)},
        {name: "name", title: "Product name", getCellValue: row => (row.name)},
        {name: 'available', title: 'In stock', getCellValue: row => (row.available)},
        {name: 'category.name', title: 'Category', getCellValue: row => (row.category.name)}
    ];

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
            >
                <EditingState
                    onCommitChanges={commitChanges}
                    editingCells={editingCells}
                />
                <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={2}
                />
                <IntegratedPaging/>
                <Table/>
                <TableHeaderRow/>
                <PagingPanel/>
            </Grid>
            {/*{loading && <Loading />}*/}
        </Paper>
    );
}
