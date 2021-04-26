import React from "react";
import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router";
import Hidden from "@material-ui/core/Hidden";
import AssessmentIcon from "@material-ui/icons/Assessment";
import IconButton from "@material-ui/core/IconButton";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AssignmentIcon from "@material-ui/icons/Assignment";
import RedeemIcon from "@material-ui/icons/Redeem";
import GroupIcon from '@material-ui/icons/Group';

export function TopBar() {

    const history = useHistory()

    const navigateTo = (link: string) => {
        history.push(link)
    }

    return (
        <AppBar position="static" >
            <Toolbar style={{justifyContent: 'space-between'}}>
                <Hidden mdDown>
                    <Typography variant="h6">
                        Small Business Registry
                    </Typography>
                </Hidden>
                <nav>
                    <Hidden xsDown>
                        <Button color="inherit" onClick={() => navigateTo('/')}>
                            Statistics
                        </Button>
                    </Hidden>
                    <Hidden xsDown>
                        <Button color="inherit" onClick={() => navigateTo('/products')}>
                            Products
                        </Button>
                    </Hidden>
                    <Hidden xsDown>
                        <Button color="inherit" onClick={() => navigateTo('/customers')}>
                            Customers
                        </Button>
                    </Hidden>
                    <Hidden xsDown>
                        <Button color="inherit" onClick={() => navigateTo('/orders')}>
                            Orders
                        </Button>
                    </Hidden>
                    <Hidden xsDown>
                        <Button color="inherit" onClick={() => navigateTo('/sales')}>
                            Sales
                        </Button>
                    </Hidden>

                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <IconButton color="inherit" onClick={() => navigateTo('/')}>
                            <AssessmentIcon/>
                        </IconButton>
                    </Hidden>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <IconButton color="inherit" onClick={() => navigateTo('/products')}>
                            <RedeemIcon/>
                        </IconButton>
                    </Hidden>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <IconButton color="inherit" onClick={() => navigateTo('/customers')}>
                            <GroupIcon/>
                        </IconButton>
                    </Hidden>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <IconButton color="inherit" onClick={() => navigateTo('/orders')}>
                            <AssignmentIcon/>
                        </IconButton>
                    </Hidden>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <IconButton color="inherit" onClick={() => navigateTo('/sales')}>
                            <MonetizationOnIcon/>
                        </IconButton>
                    </Hidden>
                </nav>
                <Button color="inherit" onClick={() => {
                    localStorage.setItem('accessToken', '')
                    navigateTo('/login')
                }}>Logout</Button>
            </Toolbar>
        </AppBar>
    )
}