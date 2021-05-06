import NewEntityDialog from './NewEntityDialog'
import React, { useState } from 'react'
import { AxiosInstance } from 'axios'
import { Column, CustomPaging, PagingState, RowDetailState, TableColumnWidthInfo } from '@devexpress/dx-react-grid'
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnResizing,
  TableHeaderRow,
  TableRowDetail
} from '@devexpress/dx-react-grid-material-ui'
import { mutate } from 'swr'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import LinearProgress from '@material-ui/core/LinearProgress'

interface ParentListProps<Parent, Children> {
  api: AxiosInstance
  apiPrefix: string
  parentColumnsGetter: (deleteItem: (id: number) => void) => Column[]
  newEntityRender: (afterSubmit: () => void) => JSX.Element
  newEntityTitle: string
  childrenRowsGetter: (row: Parent) => Children[]
  childrenColumns: Column[]
  useParent: (queryString: string) => any
  createQueryString: (pagingFilteringSorting: any) => string
  parentColumnWidths: TableColumnWidthInfo[]
  renderFilterer: (setFilterFn: (paramName: string, paramValue: string) => void) => JSX.Element
  renderSorter: (
    setSorterFn: (order: 'asc' | 'desc' | '', sortParam: string) => void
  ) => JSX.Element
}

export default function ParentList<Parent, Children>(props: ParentListProps<Parent, Children>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [filter, setFilter] = useState({ paramName: '', paramValue: '' })
  const [sorter, setSorter] = useState({ sortParam: '', order: '' })
  const queryString = props.createQueryString({
    paging: { page: currentPage, size: 5 },
    filtering: { paramName: filter.paramName, paramValue: filter.paramValue },
    sorting: { sortParam: sorter.sortParam, order: sorter.order }
  })
  const { data, isLoading, isError } = props.useParent(queryString)

  console.log(data)

  const deleteItem = (id: number) => {
    if (isLoading) return

    if (window.confirm('Are you sure you want to delete this row?')) {
      //setLoading(true)
      props.api
        .delete(props.apiPrefix + '/' + id)
        .then(() => {
          // setAlertElement(ShowAlert("success", "Order deleted"))
          // setAlertOpen(true)
          // setRefresh(true)
        })
        .catch((reason) => {
          console.log(reason)
          // setAlertElement(ShowAlert("error", "Deleting Order failed!"))
          // setAlertOpen(true)
        })
      //.finally(() => setLoading(false))
    }
  }

  const columns = props.parentColumnsGetter(deleteItem)

  const ChildrenGrid = (data: any) => {
    return (
      <Grid
        rows={props.childrenRowsGetter(data.row)}
        columns={props.childrenColumns}
        getRowId={(row) => row.id}>
        <Table/>
        <TableHeaderRow/>
        <RowDetailState/>
      </Grid>
    )
  }
  console.log(props.parentColumnsGetter((id => {
  })))
  console.log(props.parentColumnWidths)

  return (
    <>
      <Grid rows={data ? data.content : []} columns={columns} getRowId={(row) => row.id}>
        <PagingState currentPage={currentPage} onCurrentPageChange={setCurrentPage} pageSize={5}/>
        <CustomPaging totalCount={data ? data.totalElements : 0}/>
        <Table/>
        <TableColumnResizing defaultColumnWidths={props.parentColumnWidths} resizingMode="nextColumn"/>
        <TableHeaderRow/>
        <RowDetailState/>
        <TableRowDetail contentComponent={ChildrenGrid}/>
        <PagingPanel/>
      </Grid>

      <NewEntityDialog
        render={props.newEntityRender}
        title={props.newEntityTitle}
        afterSubmit={async () => {
          await mutate(props.createQueryString({ paging: { page: currentPage, size: 5 } }))
        }}
      />
      {isLoading && <LinearProgress style={{ width: '100%' }}/>}
      {props.renderFilterer((paramName, paramValue) =>
        setFilter({ paramName: paramName, paramValue: paramValue })
      )}
      {props.renderSorter((order, sortParam) => setSorter({ sortParam: sortParam, order: order }))}
    </>
  )
}
