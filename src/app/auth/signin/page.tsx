'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => signIn('google')}
            className="w-full btn-primary"
          >
            Sign in with Google
          </button>
          
          <button
            onClick={() => signIn('github')}
            className="w-full btn-secondary"
          >
            Sign in with GitHub
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-primary-600 hover:text-primary-500">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}