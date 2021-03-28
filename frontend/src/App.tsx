import React from 'react';
import Dashboard from "./Dashboard";
import TempContent from "./tempContent/TempContent";
import Navigation from "./Navigation";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Products from "./model/Product";
import {OrderForm} from "./model/OrderForm";

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
                    <Route path="/shops" exact component={OrderForm}/>
                    <Route path="/sales" exact component={TempThree}/>
                    <Route path="/orders" exact component={TempFour}/>
                </Switch>
            </Dashboard>
        </Router>
    );
}


export default App;
