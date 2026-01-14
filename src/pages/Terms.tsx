import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, Scale, AlertTriangle, Users, CreditCard, Gavel } from 'lucide-react';
import Footer from '@/components/Footer';
const Terms = () => {
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
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">Terms of Service</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Please read these terms carefully before using Ad Atelier AI. By using our service, you agree to these terms.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Last updated: January 17, 2025
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Scale className="w-6 h-6 text-primary" />
                  <CardTitle>Acceptance of Terms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  By accessing and using Ad Atelier AI ("Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-muted-foreground">
                  These terms apply to all visitors, users, and others who access or use the service.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-primary" />
                  <CardTitle>Use License</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Permission is granted to temporarily use Ad Atelier AI for personal and commercial purposes. This includes:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Uploading images to generate AI-powered captions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Using generated captions for social media posts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Sharing content created with our service</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Integrating our service into your content creation workflow</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  <CardTitle>Prohibited Uses</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You may not use our service for any of the following:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Uploading illegal, harmful, or inappropriate content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Attempting to reverse engineer or hack the service</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Spamming or automated abuse of the service</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Violating intellectual property rights</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Creating content that promotes hate speech or discrimination</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <CardTitle>Service Availability</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Free Service</h4>
                  <p className="text-muted-foreground">
                    Ad Atelier AI is currently provided as a free service. We reserve the right to introduce 
                    pricing plans or limitations in the future with appropriate notice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">API Usage</h4>
                  <p className="text-muted-foreground">
                    Users can provide their own Google Gemini API keys for enhanced functionality. 
                    API usage costs are borne by the user and subject to Google's pricing and terms.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Interruptions</h4>
                  <p className="text-muted-foreground">
                    We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
                    Scheduled maintenance will be announced in advance when possible.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Gavel className="w-6 h-6 text-primary" />
                  <CardTitle>Intellectual Property</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Your Content</h4>
                  <p className="text-muted-foreground">
                    You retain full ownership of any images you upload and captions generated using our service. 
                    We do not claim any rights to your content.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Our Service</h4>
                  <p className="text-muted-foreground">
                    The Ad Atelier AI service, including its original content, features, and functionality, 
                    is owned by us and protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Generated Captions</h4>
                  <p className="text-muted-foreground">
                    AI-generated captions are provided as-is. While we strive for quality and accuracy, 
                    you are responsible for reviewing and editing content before use.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  <CardTitle>Disclaimer & Limitation of Liability</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, 
                  this Company:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Excludes all representations and warranties relating to this service</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Excludes all liability for damages arising out of or in connection with your use of this service</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Does not guarantee the accuracy or quality of AI-generated content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We reserve the right to revise these terms at any time. By using this service, 
                  you are agreeing to be bound by the then current version of these terms of service.
                </p>
                <p className="text-muted-foreground">
                  Significant changes will be communicated through our service or via email if you have provided one.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="shadow-elegant border-0 bg-gradient-primary text-white">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Questions About These Terms?</h3>
              <p className="opacity-90">
                If you have any questions about these terms of service, please contact our support team.
              </p>
              <Button variant="secondary" size="lg">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Terms;