import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../context/AuthContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/Form'
import Input from '../ui/Input'
import Button from '../ui/Button'

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default function AuthDialog({ open, onOpenChange, onSuccess }) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')

  const loginForm = useForm({ resolver: zodResolver(loginSchema) })
  const signupForm = useForm({ resolver: zodResolver(signupSchema) })

  const handleLogin = async (data) => {
    setError('')
    try {
      const user = await login(data)
      onOpenChange(false)
      onSuccess?.(user)
    } catch {
      setError('Invalid email or password.')
    }
  }

  const handleSignup = async (data) => {
    setError('')
    try {
      const user = await register(data)
      onOpenChange(false)
      onSuccess?.(user)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create account. Try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tab === 'login' ? 'Sign in to continue' : 'Create your account'}</DialogTitle>
          <DialogDescription>You need an account to connect with a mentor.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v); setError('') }}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4" noValidate>
                <FormField control={loginForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={loginForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <Button type="submit" loading={loginForm.formState.isSubmitting} className="w-full h-11">
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4" noValidate>
                <FormField control={signupForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Full Name</FormLabel>
                    <FormControl><Input placeholder="Rahul Sharma" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={signupForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={signupForm.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Phone</FormLabel>
                    <FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={signupForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="At least 8 characters" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <Button type="submit" loading={signupForm.formState.isSubmitting} className="w-full h-11">
                  Create Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
