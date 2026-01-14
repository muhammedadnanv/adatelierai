import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield, Lock, Key, Server, Eye, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import Footer from '@/components/Footer';

const Security = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data transmission is encrypted using industry-standard TLS 1.3 protocols.",
      status: "Active"
    },
    {
      icon: Key,
      title: "Local API Key Storage",
      description: "Your API keys are encrypted and stored locally in your browser, never on our servers.",
      status: "Active"
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade cloud infrastructure with 24/7 monitoring.",
      status: "Active"
    },
    {
      icon: Eye,
      title: "Zero Data Retention",
      description: "Uploaded images are automatically deleted after processing - we don't store your content.",
      status: "Active"
    }
  ];

  const certifications = [
    {
      title: "SOC 2 Type II",
      description: "Compliance with security, availability, and confidentiality standards",
      status: "Verified"
    },
    {
      title: "GDPR Compliant",
      description: "Full compliance with European data protection regulations",
      status: "Verified"
    },
    {
      title: "ISO 27001",
      description: "International standard for information security management",
      status: "In Progress"
    }
  ];

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
            <h1 className="text-2xl md:text-4xl font-bold">Security & Trust</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Your security is our top priority. Learn how we protect your data and ensure the highest security standards.
            </p>
            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs md:text-sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              Enterprise-Grade Security
            </Badge>
          </div>

          {/* Security Features */}
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Security Features</h2>
              <p className="text-muted-foreground">
                Built with security in mind from the ground up
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="shadow-elegant border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">
                            {feature.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Data Protection */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6 text-primary" />
                <CardTitle>Data Protection</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Image Processing
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Images are processed in memory and automatically deleted after caption generation. 
                    No permanent storage of your content.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    API Key Security
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Your API keys are encrypted using AES-256 and stored only in your browser's 
                    secure local storage.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Zero Logging
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We don't log or store any personal information, image content, or generated captions 
                    on our servers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Secure Transmission
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    All communication between your browser and our servers uses TLS 1.3 encryption 
                    with perfect forward secrecy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance & Certifications */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Badge className="w-6 h-6 text-primary" />
                <CardTitle>Compliance & Certifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-6">
                We adhere to industry-standard security frameworks and regulations to ensure your data is protected.
              </p>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      {cert.status === "Verified" ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Zap className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{cert.title}</h4>
                        <Badge variant={cert.status === "Verified" ? "default" : "outline"}>
                          {cert.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Best Practices */}
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-primary" />
                <CardTitle>Security Best Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Here are some recommendations to keep your experience secure:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Protect Your API Keys</h4>
                    <p className="text-muted-foreground text-sm">
                      Never share your Google Gemini API keys with others. Regenerate them periodically for enhanced security.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Use Strong Passwords</h4>
                    <p className="text-muted-foreground text-sm">
                      If you create an account with Google, ensure you use a strong, unique password and enable 2FA.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Review Content</h4>
                    <p className="text-muted-foreground text-sm">
                      Always review AI-generated captions before publishing to ensure they meet your standards and guidelines.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Report Issues</h4>
                    <p className="text-muted-foreground text-sm">
                      If you notice any suspicious activity or security concerns, please report them immediately to our team.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident Response */}
          <Card className="shadow-elegant border-0 bg-gradient-primary text-white">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Security Incident Response</h3>
              <p className="opacity-90 max-w-2xl mx-auto">
                We have a 24/7 security incident response team ready to address any potential security issues. 
                If you discover a security vulnerability, please report it responsibly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Report Security Issue
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  Contact Security Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Security;