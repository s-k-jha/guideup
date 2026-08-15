import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail } from 'lucide-react'
import { useMentorAuth } from '../../context/MentorAuthContext'
import Seo from '../../lib/seo'
import Logo from '../../components/layout/Logo'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/Form'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

export default function MentorLoginPage() {
  const navigate = useNavigate()
  const { login } = useMentorAuth()
  const [error, setError] = useState('')

  const form = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setError('')
    try {
      await login(data)
      navigate('/mentor/dashboard')
    } catch {
      setError('Invalid email or password. If you were recently approved, ask GuideUp for your login details.')
    }
  }

  return (
    <>
      <Seo title="Mentor Login" path="/mentor/login" noindex />
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <Card className="p-6">
            <h1 className="text-h3 text-foreground mb-1 text-center">Mentor Sign In</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Manage your profile and availability</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl><Input icon={Mail} placeholder="you@example.com" error={!!form.formState.errors.email} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password</FormLabel>
                    <FormControl><Input icon={Lock} type="password" placeholder="••••••••" error={!!form.formState.errors.password} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
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
