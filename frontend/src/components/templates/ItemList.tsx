import React from "react";
import {
    Column,
    IntegratedFiltering,
    IntegratedPaging, IntegratedSorting,
    PagingState,
    SearchState,
    SortingState
} from "@devexpress/dx-react-grid";
import {api, useItems} from "../utils/DataProvider";
import IconButton from "@material-ui/core/IconButton";
import {Link} from "react-router-dom";
import {Delete, Edit} from "@material-ui/icons";
import {Grid, PagingPanel, SearchPanel, Table, TableHeaderRow, Toolbar} from "@devexpress/dx-react-grid-material-ui";
import NewEntityDialog from "./NewEntityDialog";
import LinearProgress from "@material-ui/core/LinearProgress";


export interface ItemListProps {
    newEntityRender: (afterSubmit: () => void) => (JSX.Element)
    newEntityTitle: string
    apiPrefix: string
    itemColumns: Column[]
}

export default function ItemList(props: ItemListProps) {

    const {items, isLoading, isError, mutate} = useItems(props.apiPrefix)

    const deleteItem = (id: number) => {
        if (isLoading) return

        if (window.confirm('Are you sure you want to delete this row?')) {
            //setLoading(true)
            api.delete(props.apiPrefix + '/' + id)
                .then(() => {
                    // setAlertElement(ShowAlert("success", "Order deleted"))
                    // setAlertOpen(true)
                    // setRefresh(true)
                })
                .catch(reason => {
                    console.log(reason)
                    // setAlertElement(ShowAlert("error", "Deleting Order failed!"))
                    // setAlertOpen(true)
                })
            //.finally(() => setLoading(false))
        }
    }


    const actionColumn = {
        name: '', title: '', getCellValue: (row: any) => (
            <>
                {/*<IconButton component={Link} to={props.apiPrefix + '/' + row.id}><Edit color="primary"/></IconButton>*/}
                <IconButton component={Link} to={props.apiPrefix + '/' + row.id}><Edit color="primary"/></IconButton>
                <IconButton onClick={() => {
                    //@ts-ignore
                    deleteItem(row.id)
                }}><Delete color="primary"/></IconButton>
            </>
        )
    }

    const columns = props.itemColumns.concat(actionColumn)

    return (
        <>
            <Grid rows={items ? items : []}
                  columns={columns}
                  getRowId={row => row.id}>
                <SearchState/>
                <IntegratedFiltering />
                <SortingState/>
                <IntegratedSorting/>
                <PagingState defaultCurrentPage={0} pageSize={4}/>
                <IntegratedPaging/>
                <Table/>
                <TableHeaderRow showSortingControls/>
                <PagingPanel/>
                <Toolbar/>
                <SearchPanel/>
            </Grid>

            <NewEntityDialog render={props.newEntityRender} title={props.newEntityTitle}
                             afterSubmit={async () => {
                                 await mutate()
                             }}/>
            {isLoading && <LinearProgress style={{width: '100%'}}/>}
        </>
    )

}