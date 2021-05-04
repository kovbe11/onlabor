import ParentList from '../templates/ParentList'
import { Sale, SoldItem } from '../../model/Sale'
import IconButton from '@material-ui/core/IconButton'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@material-ui/icons'
import React from 'react'
import { NewSaleForm } from './SaleEditor'
import { Column, TableColumnWidthInfo } from '@devexpress/dx-react-grid'
import { api, createParentQueryString, useSales } from '../utils/DataProvider'
import SaleSorterDialog from './SaleSorterDialog'
import SaleFiltererDialog from './SaleFiltererDialog'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const saleColumns = (deleteItem: (id: number) => void) => [
  { name: 'saleDate', title: 'Sale date', getCellValue: (row: Sale) => row.saleDate },
  { name: 'sum', title: 'Sale value', getCellValue: (row: Sale) => row.saleValue },
  { name: 'buyer', title: 'Buyer', getCellValue: (row: Sale) => (
    <>
      {row.buyer && <IconButton component={Link} to={'/customers/' + row.buyer.id}>
        <AccountCircleIcon color="primary"/>
      </IconButton>}
      {row.buyer?.name}
      </>
    )},
  {
    name: 'actions',
    title: ' ',
    getCellValue: (row: Sale) => (
      <>
        <IconButton component={Link} to={'/sales/' + row.id}>
          <Edit color="primary" />
        </IconButton>
        <IconButton
          onClick={() => {
            // @ts-ignore
            deleteItem(row.id)
          }}>
          <Delete color="primary" />
        </IconButton>
      </>
    ),
  },
]

const saleColumnWidths: TableColumnWidthInfo[] = [
  {columnName: 'saleDate', width: '25%'},
  {columnName: 'sum', width: '20%'},
  {columnName: 'buyer', width: '30%'},
  {columnName: 'actions', width: '15%'}
]

const soldItemColumns: Column[] = [
  { name: 'product', title: 'Product name', getCellValue: (row: SoldItem) => row.product.name },
  { name: 'price', title: 'Price', getCellValue: (row: SoldItem) => row.price },
  { name: 'amount', title: 'Amount', getCellValue: (row: SoldItem) => row.amount },
]

function getChildrenRow(row: Sale) {
  return row.soldItems
}

export default function SaleList() {
  return (
    <ParentList<Sale, SoldItem>
      api={api}
      apiPrefix="/sales"
      parentColumnsGetter={saleColumns}
      parentColumnWidths={saleColumnWidths}
      newEntityRender={(afterSubmit: () => void) => (
        <NewSaleForm executeAfterSubmit={afterSubmit} />
      )}
      newEntityTitle="Create new Sale"
      childrenRowsGetter={getChildrenRow}
      childrenColumns={soldItemColumns}
      createQueryString={createParentQueryString}
      useParent={useSales}
      renderFilterer={(setFilterFn) => <SaleFiltererDialog setFilterFn={setFilterFn} />}
      renderSorter={(setSorterFn) => <SaleSorterDialog setSorterFn={setSorterFn} />}
    />
  )
}
