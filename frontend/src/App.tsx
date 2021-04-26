import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import OrderList from "./components/order/OrderList";
import NotFound from "./components/layout/NotFound";
import {EditOrderForm} from "./components/order/OrderEditor";
import {EditSaleForm} from "./components/sale/SaleEditor";
import SaleList from "./components/sale/SaleList";
import {PrivateRoute, RestrictedRoute} from "./components/auth/Routes";
import Login from "./components/auth/Login";
import ProductList from "./components/product/ProductList";
import {EditProductForm} from "./components/product/ProductEditor";
import PaperWithAlertContainer from "./components/layout/PaperWithAlertContainer";
import CustomerList from "./components/customer/CustomerList";
import {EditCustomerForm} from "./components/customer/CustomerEditor";
import {Statistics} from "./components/statistics/Statistics";

function componentWithDashboard(Component: () => JSX.Element) {
    return () => (
        <PaperWithAlertContainer render={showAlert => (<Component/>)}/>
    )
}

function App() {
    return (
        <Router>
            <Switch>
                <PrivateRoute path="/" exact component={componentWithDashboard(Statistics)}/>
                <PrivateRoute path="/products/:id" exact component={componentWithDashboard(EditProductForm)}/>
                <PrivateRoute path="/products" exact component={componentWithDashboard(ProductList)}/>
                <PrivateRoute path="/customers/:id" exact component={componentWithDashboard(EditCustomerForm)}/>
                <PrivateRoute path="/customers" exact component={componentWithDashboard(CustomerList)}/>
                <PrivateRoute path="/sales/:id" exact component={componentWithDashboard(EditSaleForm)}/>
                <PrivateRoute path="/sales" exact component={componentWithDashboard(SaleList)}/>
                <PrivateRoute path="/orders/:id" exact component={componentWithDashboard(EditOrderForm)}/>
                <PrivateRoute path="/orders" exact component={componentWithDashboard(OrderList)}/>
                <RestrictedRoute path="/login" exact component={Login}/>
                <Route path="*" render={
                    () => (<NotFound notFoundMessage="Couldn't find this page!" redirectBackLink="/"/>)
                }/>
            </Switch>
        </Router>
    );
}


export default App;
