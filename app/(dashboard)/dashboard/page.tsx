"use client"
import { getDashboard, getProfile } from '@/store/thunk/auth.thunk'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function Dashboard() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getProfile())
        dispatch(getDashboard())
    }, [])
    return (
        <div>
        </div>
    )
}

export default Dashboard