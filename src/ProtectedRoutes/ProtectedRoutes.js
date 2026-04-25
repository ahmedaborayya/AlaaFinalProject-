import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { TockenContext} from '../Context/Token';


const ProtectedRoutes = (props) => {
 let navigate = useNavigate()
if( localStorage.getItem("userToken")!=null){
     return props.children
    } else {
    return <Navigate to={'/login'} />
}
  }


export default ProtectedRoutes;
