import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(30, 'First name must be less than 30 characters'),
  last_name: z.string().min(1, 'Last name is required').max(30, 'Last name must be less than 30 characters'),
  e_mail_id: z.string().email('Invalid email address').max(30),
  phone: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'Password must be less than 30 characters')
    .regex(/[a-z]/i, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      e_mail_id: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        e_mail_id: data.e_mail_id,
        phone: data.phone,
        password: data.password,
      });
      navigate(`/auth/confirm?email=${encodeURIComponent(data.e_mail_id)}`);
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 hidden md:block">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Join DIY Components</h1>
            <p className="text-xl opacity-90">
              Start your electronics journey with quality components
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '⚡', text: 'Fast Delivery Across India' },
              { icon: '🛡️', text: 'Genuine Components Only' },
              { icon: '🎧', text: 'Expert Support Available' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm opacity-80">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5K+</div>
              <div className="text-sm opacity-80">Happy Makers</div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join thousands of makers who trust DIY Components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" maxLength={15} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" maxLength={15} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="e_mail_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md text-muted-foreground text-sm">
                            +91
                          </span>
                          <Input
                            type="tel"
                            placeholder="9876543210"
                            maxLength={10}
                            className="rounded-l-none"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            maxLength={30}
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>

                <div className="text-center space-y-2 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                      to="/auth/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign In
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <Link to="/help/tnc" className="hover:underline">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link to="/help/privacy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
