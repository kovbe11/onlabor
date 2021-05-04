import React from 'react'
import { Column, TableColumnWidthInfo } from '@devexpress/dx-react-grid'
import { Order, OrderItem } from '../../model/Order'
import { Delete, Edit } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import { NewOrderForm } from './OrderEditor'
import ParentList from '../templates/ParentList'
import { api, createParentQueryString, useOrders } from '../utils/DataProvider'
import { OrderFiltererDialog } from './OrderFiltererDialog'
import { OrderSorterDialog } from './OrderSorterDialog'

function statusMapper(status: string){
  if(status === 'JUST_ORDERED'){
    return 'Just ordered'
  }
  if(status === 'WAITING_TO_BE_ORDERED'){
    return 'Waiting'
  }
  if(status === 'ARRIVED'){
    return 'Arrived'
  }
  return ''
}

function determineOrderStatus(order: Order) {
  let result: string[] = []

  order.orderItems.forEach((item) => {
    if(!result.includes(item.status)){
      result.push(item.status)
    }
  })
  
  return result.map(statusMapper).join(', ')
}

const orderItemColumns: Column[] = [
  {
    name: 'product',
    title: 'Product name',
    getCellValue: (row) => row.product.name,
  },
  { name: 'price', title: 'Price', getCellValue: (row) => row.price },
  { name: 'amount', title: 'Amount', getCellValue: (row) => row.amount },
  { name: 'status', title: 'Status', getCellValue: (row) => row.status },
]

const orderColumns = (deleteItem: (id: number) => void) => [
  {
    name: 'orderDate',
    title: 'Order date',
    getCellValue: (row: Order) => row.orderDate,
  },
  {
    name: 'sum',
    title: 'Order value',
    getCellValue: (row: Order) => row.orderValue,
  },
  {
    name: 'statuses',
    title: 'Order status(es)',
    getCellValue: (row: Order) => determineOrderStatus(row),
  },
  {
    name: 'actions',
    title: ' ',
    getCellValue: (row: Order) => (
      <>
        <IconButton component={Link} to={'/orders/' + row.id}>
          <Edit color="primary" />
        </IconButton>
        <IconButton
          onClick={() => {
            //@ts-ignore
            deleteItem(row.id)
          }}>
          <Delete color="primary" />
        </IconButton>
      </>
    ),
  },
]

const orderColumnWidths: TableColumnWidthInfo[] = [
  {columnName: 'orderDate', width: '25%'},
  {columnName: 'sum', width: '25%'},
  {columnName: 'statuses', width: '25%'},
  {columnName: 'actions', width: '15%'}
]

const getChildrenRow = (row: Order) => {
  return row.orderItems
}

export const OrderList = () => (
  <ParentList<Order, OrderItem>
    api={api}
    parentColumnsGetter={orderColumns}
    parentColumnWidths={orderColumnWidths}
    newEntityRender={(afterSubmit: () => void) => <NewOrderForm executeAfterSubmit={afterSubmit} />}
    newEntityTitle="Create new Order"
    childrenRowsGetter={getChildrenRow}
    childrenColumns={orderItemColumns}
    createQueryString={createParentQueryString}
    useParent={useOrders}
    renderFilterer={(setFilterFn) => <OrderFiltererDialog setFilterFn={setFilterFn} />}
    renderSorter={(setSorterFn) => <OrderSorterDialog setSorterFn={setSorterFn} />}
    apiPrefix="/orders"
  />
)
