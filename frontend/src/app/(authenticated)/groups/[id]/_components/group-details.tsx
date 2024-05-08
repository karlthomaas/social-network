import React from 'react'

export const GroupDetails = ({ title, description}: { title: string, description: string}) => {
  return (
    <div>
        <h1 className='text-4xl'>{title}</h1>
        <p className='text-lg'>{description}</p>
    </div>
  )
}
