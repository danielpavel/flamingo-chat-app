import React from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'

function loading() {
  return (
    <div className='flex items-center py-10 justify-center'>
      <LoadingSpinner />
    </div>
  )
}

export default loading