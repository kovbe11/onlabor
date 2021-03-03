import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RedeemIcon from '@material-ui/icons/Redeem';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssessmentIcon from '@material-ui/icons/Assessment';
import StorefrontIcon from '@material-ui/icons/Storefront';
import navigationData from "./navigatonData.json"
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import {Link} from "react-router-dom";

interface NavigationItemProps {
    title: string,
    linkTo: string,
    iconName?: string,
    children?: NavigationItemProps[],
    isNested?: boolean
}

interface Mapping {
    [key: string]: JSX.Element
}

const iconMapping: Mapping = {
    product: <RedeemIcon/>,
    order: <AssignmentIcon/>,
    sale: <MonetizationOnIcon/>,
    shop: <StorefrontIcon/>,
    statistics: <AssessmentIcon/>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 240,
            backgroundColor: theme.palette.background.paper,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

function mapItemDataToItem(value: NavigationItemProps, isNested: boolean) {
    // if (value.children) return <NestedNavigationItem title={value.title} linkTo={value.linkTo}
    //                                                  iconName={value.iconName} children={value.children}/>

    return <NavigationItem title={value.title} linkTo={value.linkTo}
                           iconName={value.iconName} isNested={isNested}/>
}

// function NestedNavigationItem(props: NavigationItemProps) {
//     const [open, setOpen] = useState(false)
//
//     const handleClick = () => {
//         setOpen(!open);
//     }
//
//     return (
//         <>
//             <ListItem button>
//                 {props.iconName &&
//                 <ListItemIcon>
//                     {iconMapping[props.iconName]}
//                 </ListItemIcon>
//                 }
//                 <ListItemText primary={props.title}/>
//                 <ListItemSecondaryAction onClick={handleClick}>
//                     {open ? <ExpandLess/> : <ExpandMore/>}
//                 </ListItemSecondaryAction>
//             </ListItem>
//             {props.children &&
//             <Collapse in={open} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                     {props.children.map((value) => mapItemDataToItem(value, true))}
//                 </List>
//             </Collapse>
//             }
//
//         </>
//     )
// }

function NavigationItem(props: NavigationItemProps) {

    const classes = useStyles()

    return (
        <ListItem key={props.title} component={Link} to={props.linkTo} button
                  className={props.isNested ? classes.nested : ""}>
            {props.iconName &&
            <ListItemIcon>
                {iconMapping[props.iconName]}
            </ListItemIcon>
            }
            <ListItemText primary={props.title}/>
        </ListItem>
    )

}

export default function Navigation() {
    const classes = useStyles()

    return (
        <List
            component="nav"
            className={classes.root}
        >
            {navigationData.map((value) => mapItemDataToItem(value, false))}
        </List>
    )
}
