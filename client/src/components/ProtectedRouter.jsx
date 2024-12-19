import React from 'react'
import { Navigate , Outlet} from 'react-router-dom'

const ProtectRoute = ({children, user ,redirect='/signup'}) => {
  if(!user) return <Navigate to={redirect} replace /> 
  return <Outlet /> 
}

export default ProtectRoute
