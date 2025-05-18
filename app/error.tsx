'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="m-12 bg-gray-700 p-12 rounded-lg text-white">
      <h2 className="text-3xl font-bold">Something went wrong!</h2>
      <p>{error.message}</p>
      <h2 className="text-2xl font-bold">Note:</h2>
      <p className="p-2">
        You need to configure the environment variables, Check the readme.md file for more information.
      </p>
      <p className="p-2">
        The environment variables are AIRTABLE_TOKEN,UNSPLASH_ACCESS_KEY.Create a .env.local file and add the variables.
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}