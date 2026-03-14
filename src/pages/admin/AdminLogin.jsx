import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, User } from 'lucide-react'
import { adminLogin } from '../../api/admin'
import PrimaryButton from '../../components/PrimaryButton'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

export default function AdminLogin() {

  const navigate = useNavigate()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
  setError('')

  try {

    const res = await adminLogin(data)

    const token = res.data.token   // correct path

    if (token) {
      localStorage.setItem('admin_token', token)
    }

    navigate('/admin')

  } catch (err) {
    setError('Invalid credentials. Please try again.')
  }
}


  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-sm">

        <div className="text-center mb-8">

          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Admin Login
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            GuideUp Dashboard
          </p>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>

              <div className="relative">

                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  {...register('email')}
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
                  placeholder="admin@example.com"
                />

              </div>

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  {...register('password')}
                  type="password"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
                  placeholder="••••••••"
                />

              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg p-2">
                {error}
              </p>
            )}

            <PrimaryButton
              type="submit"
              loading={isSubmitting}
            >
              Sign In
            </PrimaryButton>

          </form>

        </div>

      </div>

    </div>

  )
}
