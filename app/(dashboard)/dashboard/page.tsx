"use client"
import React from 'react'
import { useSelector } from 'react-redux'

function Dashboard() {
    const { user } = useSelector((s) => s.auth)
    return (
        <div>
            <h1>Welcome To Agency </h1>
            <h3>{user?.name}</h3>
        </div>
    )
}

export default Dashboard
