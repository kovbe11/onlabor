import React, {useState} from "react";
import {Grid as DataGrid, Table, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CircularProgress from "@material-ui/core/CircularProgress";




interface ProductStatisticsProps {
    top5ProductProfits: any[]
    top5ProductLosses: any[]
    isLoading: boolean
}

export function ProductStatistics(props: ProductStatisticsProps) {

    const [isGood, setIsGood] = useState(true)

    const columns = [
        {name: "productName", title: "Product name", getCellValue: (row: any) => (row.product.name)},
        {name: "income", title: "Income from product", getCellValue: (row: any) => (row.productStatistics.income)},
        {name: "expense", title: "Expenses from product", getCellValue: (row: any) => (row.productStatistics.expense)},
        {name: "profit", title: "Profit from product", getCellValue: (row: any) => (row.productStatistics.profit)},
        {name: "lastSale", title: "Date of last sale", getCellValue: (row: any) => (row.productStatistics.lastSale)},
    ]

    const CustomSwitch = () => (
        <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Bad investments</Grid>
                <Grid item>
                    <Switch checked={isGood} onChange={(event)=> {setIsGood(event.target.checked)}}/>
                </Grid>
                <Grid item>Good investments</Grid>
            </Grid>
        </Typography>
    )

    if(props.isLoading){
        return <CircularProgress/>
    }

    if(!isGood){
        return (
            <>
                <CustomSwitch/>
                <DataGrid rows={props.top5ProductLosses ? props.top5ProductLosses : []}
                          columns={columns}>
                    <Table/>
                    <TableHeaderRow/>
                </DataGrid>
            </>
        )
    }

    return (
        <>
            <CustomSwitch/>
            <DataGrid rows={props.top5ProductProfits ? props.top5ProductProfits : []}
                      columns={columns}>
                <Table/>
                <TableHeaderRow/>
            </DataGrid>
        </>
    )
}