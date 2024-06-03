import React from 'react'
import { useAppSelector } from '@/lib/hooks'

export const GroupDetails = ({ id }: { id: string }) => {
  const { group } = useAppSelector((state) => state.groups.groups[id])
  return (
    <div>
        <h1 className='text-4xl'>{group.title}</h1>
        <p className='text-lg'>{group.description}</p>
    </div>
  )
}
