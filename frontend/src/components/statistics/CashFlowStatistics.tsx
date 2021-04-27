import React from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CircularProgress } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'

interface CashFlowStatisticsProps {
  incomesAndExpenses: any[]
  isLoading: boolean
}

const useStyles = makeStyles({
  margin: {
    marginTop: '12px',
    marginLeft: '24px',
    marginRight: '24px',
  },
})

export function CashFlowStatistics(props: CashFlowStatisticsProps) {
  const classes = useStyles()

  if (props.isLoading) {
    return <CircularProgress />
  }

  console.log(props)

  if (!props.incomesAndExpenses) {
    return <></>
  }

  return (
    <ResponsiveContainer width="90%" height={200} className={classes.margin}>
      <LineChart data={props.incomesAndExpenses}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#8884d8" />
        <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}
