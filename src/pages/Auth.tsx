import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Users, Zap } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  // Handle any auth errors or incomplete sign-ups
  useEffect(() => {
    const handleAuthState = () => {
      // If there's an incomplete sign-up, handle it
      if (clerk.client?.signUp?.status === 'missing_requirements') {
        console.log('Sign-up requires additional information');
      }
    };
    
    handleAuthState();
  }, [clerk.client]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Socialify
            </h1>
          </div>
          <p className="text-muted-foreground">
            Transform your images into viral social media content
          </p>
        </div>

        {/* Auth Tabs */}
        <Card className="shadow-elegant border-0">
          <CardHeader className="space-y-4">
            <div className="flex justify-center space-x-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>10k+ creators</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>AI-powered</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Sign in to continue creating amazing content
                </CardDescription>
                
                <div className="flex justify-center">
                  <SignIn 
                    forceRedirectUrl="/dashboard"
                    appearance={{
                      elements: {
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "w-full hover:bg-primary/10",
                        formButtonPrimary: "w-full bg-primary hover:bg-primary/90 text-white",
                        footerAction: "hidden"
                      }
                    }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                  Join thousands of creators using AI to boost their social media
                </CardDescription>
                
                <div className="flex justify-center">
                  <SignUp 
                    forceRedirectUrl="/dashboard"
                    appearance={{
                      elements: {
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "w-full hover:bg-primary/10",
                        formButtonPrimary: "w-full bg-primary hover:bg-primary/90 text-white",
                        footerAction: "hidden"
                      }
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;