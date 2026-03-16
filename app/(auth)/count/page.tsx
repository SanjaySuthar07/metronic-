"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

function page() {
    const [countMantr, setCountMantra] = useState(1)
    return (
        <div>
            <h1>{countMantr}</h1>
            <Button onClick={() => setCountMantra((prv) => prv + 1)}>Count</Button>
        </div>
    )
}

export default page
