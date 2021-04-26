import React from 'react';
import {Column} from '@devexpress/dx-react-grid';
import {Order, OrderItem} from "../../model/Order";
import {Delete, Edit} from "@material-ui/icons";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {NewOrderForm} from "./OrderEditor";
import ParentList from "../templates/ParentList";
import {api, createParentQueryString, useOrders} from "../utils/DataProvider";
import OrderSorterDialog from "./OrderSorterDialog";
import OrderFiltererDialog from "./OrderFiltererDialog";


function determineOrderStatus(order: Order) {
    return "STATUS"
}

const orderItemColumns: Column[] = [
    {name: "product", title: "Product name", getCellValue: row => row.product.name},
    {name: "price", title: "Price", getCellValue: row => row.price},
    {name: "amount", title: "Amount", getCellValue: row => row.amount},
    {name: "status", title: "Status", getCellValue: row => row.status} // ez el fog romolni!!
]

const orderColumns = (deleteItem: (id: number) => void) => (
    [
        {name: 'id', title: 'Order ID', getCellValue: (row: Order) => (row.id)},
        {name: "orderDate", title: "Order date", getCellValue: (row: Order) => (row.orderDate)},
        {name: 'sum', title: 'Order value', getCellValue: (row: Order) => (row.orderValue)},
        {name: 'statuses', title: 'Order status(es)', getCellValue: (row: Order) => (determineOrderStatus(row))},
        {
            name: '', title: '', getCellValue: (row: Order) => (
                <>
                    <IconButton component={Link} to={'/orders/' + row.id}><Edit color="primary"/></IconButton>
                    <IconButton onClick={() => {
                        //@ts-ignore
                        deleteItem(row.id)
                    }}><Delete color="primary"/></IconButton>
                </>
            )
        }
    ]
)

function getChildrenRow(row: Order) {
    return row.orderItems
}

export default function OrderList() {

    return (
        <ParentList<Order, OrderItem> api={api}
                                      parentColumnsGetter={orderColumns}
                                      newEntityRender={(afterSubmit: () => void) =>
                                          (<NewOrderForm executeAfterSubmit={afterSubmit}/>)}
                                      newEntityTitle="Create new Order"
                                      childrenRowsGetter={getChildrenRow}
                                      childrenColumns={orderItemColumns}
                                      createQueryString={createParentQueryString}
                                      useParent={useOrders}
                                      renderFilterer={setFilterFn => (<OrderFiltererDialog setFilterFn={setFilterFn}/>)}
                                      renderSorter={setSorterFn => (
                                          <OrderSorterDialog setSorterFn={setSorterFn}/>
                                      )}
                                      apiPrefix='/orders'/>
    )
}


/*
export default function OrderList() {


    const [rows, setRows] = useState<Order[]>([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)

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


    //TODO: SWR el cachelni
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
        <>
            <Paper>
                {loading ? (<CircularProgress/>) : (
                    <>
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
                        <NewEntityDialog title="Create new Order"
                                         afterSubmit={() => {setRefresh(true)}}
                                         render={(afterSubmit: () => void) =>
                                             (<NewOrderForm executeAfterSubmit={afterSubmit}/>)}/>

                    </>)}
            </Paper>
            <>
                <Snackbar open={alertOpen} autoHideDuration={2000} onClose={() => setAlertOpen(false)}>
                    {alertElement}
                </Snackbar>
            </>
        </>

    )
}*/