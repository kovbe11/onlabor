import React from "react";
import {Grid} from "@material-ui/core";
import {CashFlowStatistics} from "./CashFlowStatistics";
import {ProductStatistics} from "./ProductStatistics";
import {useItems} from "../utils/DataProvider";


export function Statistics() {

    const {items: statistics, isLoading, isError} = useItems('/statistics')

    return (
        <Grid container>
            <Grid item xs={12}>
                <CashFlowStatistics incomesAndExpenses={statistics?.incomesAndExpenses}
                                    isLoading={isLoading}/>
            </Grid>
            <Grid item xs={12} style={{marginLeft: '24px', marginRight: '24px'}}>
                <ProductStatistics top5ProductLosses={statistics?.top5ProductLosses}
                                   top5ProductProfits={statistics?.top5ProductProfits}
                                   isLoading={isLoading}/>
            </Grid>
        </Grid>
    )
}