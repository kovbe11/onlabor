import React, {useEffect, useState} from 'react';
import {Column, IntegratedPaging, PagingState, RowDetailState} from '@devexpress/dx-react-grid';
import {Grid, PagingPanel, Table, TableHeaderRow, TableRowDetail} from '@devexpress/dx-react-grid-material-ui';
import {Order, orderApi} from "../model/Order";
import {CircularProgress, Paper} from "@material-ui/core";
import {Delete, Edit} from "@material-ui/icons";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ProductForm from "../model/ProductForm";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import {productApi} from "../model/Product";

function sumOrderItems(order: Order) {
    console.log(order)
    return 0.0
}

function determineOrderStatus(order: Order) {
    console.log(order)
    return "STATUS"
}


const OrderItems = (data: any) => {

    console.log(data)

    const columns: Column[] = [
        {name: "product", title: "Product name", getCellValue: row => row.product.name},
        {name: "price", title: "Price", getCellValue: row => row.price},
        {name: "amount", title: "Amount", getCellValue: row => row.amount},
        {name: "status", title: "Status", getCellValue: row => row.status} // ez el fog romolni!!
    ]

    return (
        <Grid
            rows={data.row.orderItems}
            columns={columns}
            getRowId={row => row.id}
        >
            <Table/>
            <TableHeaderRow/>
            <RowDetailState/>
        </Grid>
    )

}


// {
//     id: 0,
//         orderDate: new Date(),
//     orderItems: [{
//     id: 0,
//     itemIndex: 0,
//     price: 354.2,
//     amount: 30,
//     productID: 1,
//     status: "WAITING_TO_BE_ORDERED",
// }, {
//     id: 1,
//     itemIndex: 1,
//     price: 1434.2,
//     amount: 24,
//     productID: 2,
//     status: "WAITING_TO_BE_ORDERED"
// }]
// }


const ShowAlert = (severity: "error" | "success", msg: string) => (
    <Alert severity={severity}>
        {msg}
    </Alert>
)


export default function OrderList() {


    const [rows, setRows] = useState<Order[]>([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)

    const [addFormOpen, setAddFormOpen] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertElement, setAlertElement] = useState<any>(null)

    const loadData = () => {
        setRefresh(false)
        if (!loading) {
            setLoading(true)
            orderApi.get('').then(res => {
                console.log(res.data)
                setRows(res.data)
            }).catch(reason => console.log(reason))
                .finally(() => setLoading(false))
        }
    }
    const deleteItem = (id: number) => {
        console.log(id)
        return;
        if (loading) {
            return
        }
        // eslint-disable-next-line
        if (window.confirm('Are you sure you want to delete this row?')) {
            setLoading(true)
            orderApi.delete('/' + id)
                .then(() => {
                    setAlertElement(ShowAlert("success", "Order deleted"))
                    setAlertOpen(true)
                    setRefresh(true)
                })
                .catch(reason => {
                    console.log(reason)
                    setAlertElement(ShowAlert("error", "Deleting Order failed!"))
                    setAlertOpen(true)
                })
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => loadData(), [refresh])

    const columns: Column[] = [
        {name: 'id', title: 'Order ID', getCellValue: row => (row.id)},
        {name: "orderDate", title: "Order date", getCellValue: row => (row.orderDate)},
        {name: 'sum', title: 'Order value', getCellValue: row => (sumOrderItems(row))},
        {name: 'statuses', title: 'Order status(es)', getCellValue: row => (determineOrderStatus(row))},
        {
            name: '', title: '', getCellValue: row => (
                <>
                    <IconButton component={Link} to={'/orders/' + row.id}><Edit color="primary"/></IconButton>
                    <IconButton onClick={() => {
                            deleteItem(row.id)
                    }}><Delete color="primary"/></IconButton>
                </>
            )
        }
    ];

    return (
        <Paper>
            <Fab color="primary" style={{position: 'fixed', margin: '0.5%'}} hidden={addFormOpen} size="small"
                 onClick={() => setAddFormOpen(true)}>
                <AddIcon/>
            </Fab>
            <Dialog open={addFormOpen} onClose={() => setAddFormOpen(false)}>
                <DialogTitle>Create new Order</DialogTitle>
                <DialogContent>
                    <ProductForm executeAfterSubmit={() => {
                        setAddFormOpen(false)
                        setRefresh(true)
                    }}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddFormOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {loading && <CircularProgress/>}
            <Grid rows={rows}
                  columns={columns}
                  getRowId={row => row.id}>
                <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={7}
                />
                <IntegratedPaging/>
                <Table/>
                <TableHeaderRow/>
                <RowDetailState/>
                <TableRowDetail
                    contentComponent={OrderItems}
                />
                <PagingPanel/>
            </Grid>
            <Snackbar open={alertOpen} autoHideDuration={2000} onClose={() => setAlertOpen(false)}>
                {alertElement}
            </Snackbar>
        </Paper>
    )
}