import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail } from 'lucide-react'
import { adminLogin } from '../../api/admin'
import Seo from '../../lib/seo'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/Form'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

export default function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const form = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setError('')
    try {
      const res = await adminLogin(data)
      const token = res.data.token
      if (token) localStorage.setItem('admin_token', token)
      navigate('/admin')
    } catch {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <>
      <Seo title="Admin Login" path="/admin/login" noindex />
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-h3 text-foreground">Admin Login</h1>
            <p className="text-muted-foreground text-sm mt-1">GuideUp Dashboard</p>
          </div>

          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Email</FormLabel>
                      <FormControl>
                        <Input icon={Mail} placeholder="admin@example.com" error={!!form.formState.errors.email} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Password</FormLabel>
                      <FormControl>
                        <Input icon={Lock} type="password" placeholder="••••••••" error={!!form.formState.errors.password} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg p-2">{error}</p>}

                <Button type="submit" loading={form.formState.isSubmitting} className="w-full h-12">
                  Sign In
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  )
}
