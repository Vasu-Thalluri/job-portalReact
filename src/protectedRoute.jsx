import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUserFromToken } from './utitlity/auth'

export default function ProtectedRoute({children, allowedRoles}) {
    const user = getUserFromToken();
    const role = user.role;

    if(!role || !allowedRoles.includes(role)) {
        return <Navigate to='/' replace/>
    }
    return children;
}
