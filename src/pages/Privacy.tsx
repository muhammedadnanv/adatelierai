import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield, Eye, Lock, Database, User, Globe } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
            <h1 className="text-base md:text-xl font-bold font-montserrat bg-gradient-hero bg-clip-text text-transparent truncate">
              Ad Atelier AI
            </h1>
          </Link>
          
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-6 md:space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 md:space-y-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Last updated: January 17, 2025
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6">
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Eye className="w-6 h-6 text-primary" />
                  <CardTitle>Information We Collect</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Images and Content</h4>
                  <p className="text-muted-foreground">
                    When you upload images to generate captions, we temporarily process these images using Google Gemini AI. 
                    Images are not stored permanently on our servers and are automatically deleted after processing.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">API Keys</h4>
                  <p className="text-muted-foreground">
                    If you provide your own Google Gemini API key, it is encrypted and stored securely in your browser's local storage. 
                    We never store or transmit your API keys to our servers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Data</h4>
                  <p className="text-muted-foreground">
                    We collect anonymous usage statistics to improve our service, including caption generation counts and 
                    feature usage patterns. This data cannot be linked to individual users.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-primary" />
                  <CardTitle>How We Use Your Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Process your images to generate AI-powered captions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Improve our AI models and service quality</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide customer support and technical assistance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Send important service updates and security notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Lock className="w-6 h-6 text-primary" />
                  <CardTitle>Data Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>End-to-end encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Secure cloud infrastructure with regular security audits</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Automatic deletion of uploaded images after processing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Local storage of API keys with browser-level encryption</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-primary" />
                  <CardTitle>Your Rights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You have the following rights regarding your data:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Access:</strong> Request information about data we have collected</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Deletion:</strong> Request deletion of your data from our systems</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Portability:</strong> Request a copy of your data in a portable format</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Opt-out:</strong> Disable analytics and usage tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <CardTitle>Third-Party Services</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Google Gemini AI</h4>
                  <p className="text-muted-foreground">
                    We use Google Gemini AI to generate captions. Images sent to Gemini are processed according to 
                    Google's AI privacy policies and are not used to train their models.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Analytics</h4>
                  <p className="text-muted-foreground">
                    We use privacy-focused analytics to understand how our service is used. No personal information 
                    is collected or shared with third parties.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="shadow-elegant border-0 bg-gradient-primary text-white">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Questions About Privacy?</h3>
              <p className="opacity-90">
                If you have any questions about this privacy policy or how we handle your data, 
                please don't hesitate to contact us.
              </p>
              <Button variant="secondary" size="lg">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Privacy;