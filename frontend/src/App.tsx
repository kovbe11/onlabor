import React from 'react';
import Dashboard from "./Dashboard";
import TempContent from "./tempContent/TempContent";
import Navigation from "./Navigation";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Products from "./model/Product";
import OrderList from "./components/order/OrderList";
import NotFound from "./components/NotFound";
import {EditOrderForm} from "./components/order/OrderEditor";
import {EditSaleForm} from "./components/sale/SaleEditor";

function TempOne() {
    return <div>
        Products
    </div>
}

function TempTwo() {
    return <div>
        Shops
    </div>
}

function TempThree() {
    return <div>
        Sales
    </div>
}

function TempFour() {
    return <div>
        Orders
    </div>
}

function App() {
    return (
        <Router>
            <Dashboard title="Admin panel" navigation={
                <Navigation/>
            }>
                <Switch>
                    <Route path="/" exact component={TempContent}/>
                    <Route path="/products" exact component={Products}/>
                    <Route path="/shops" exact component={TempTwo}/>
                    <Route path="/sales" exact component={EditSaleForm}/>
                    <Route path="/sales/:id" exact component={EditSaleForm}/>
                    <Route path="/orders/:id" exact component={EditOrderForm}/>
                    <Route path="/orders" exact component={OrderList}/>
                    <Route path="*" render={
                        () => (<NotFound notFoundMessage="Couldn't find this page!" redirectBackLink="/"/>)
                    }/>
                </Switch>
            </Dashboard>
        </Router>
    );
}


export default App;
