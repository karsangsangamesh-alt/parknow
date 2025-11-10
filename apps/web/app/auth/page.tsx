'use client'

import React, { useState } from 'react'
import { LoginForm } from '../../components/auth/login-form'
import { RegisterForm } from '../../components/auth/register-form'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            ParkNow
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Find and book parking spaces near you
          </p>
        </div>
        
        {isLogin ? (
          <LoginForm 
            onToggleMode={() => setIsLogin(false)} 
          />
        ) : (
          <RegisterForm 
            onToggleMode={() => setIsLogin(true)} 
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage
