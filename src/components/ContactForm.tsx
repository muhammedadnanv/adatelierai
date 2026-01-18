import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Send, MessageSquare, Handshake, HelpCircle, CheckCircle2, Zap, Users, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { motion, AnimatePresence } from 'framer-motion';

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  inquiryType: z.enum(['support', 'partnership', 'feedback', 'other'], {
    required_error: "Please select an inquiry type",
  }),
  subject: z.string()
    .trim()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string()
    .trim()
    .min(20, { message: "Message must be at least 20 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inquiryTypes = [
  { value: 'support', label: 'Technical Support', icon: HelpCircle },
  { value: 'partnership', label: 'Partnership Inquiry', icon: Handshake },
  { value: 'feedback', label: 'Product Feedback', icon: MessageSquare },
  { value: 'other', label: 'Other', icon: Mail },
];

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { content, visitorType, trackClick, engagementLevel, isReturningVisitor } = usePersonalization();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      inquiryType: visitorType === 'action-taker' ? 'partnership' : undefined,
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    trackClick('cta');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: getSuccessMessage(),
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSuccessMessage = () => {
    switch (visitorType) {
      case 'action-taker':
        return "We'll get back to you within 24 hours — expect a fast response!";
      case 'comparer':
        return "We'll send you detailed information within 24-48 hours.";
      case 'explorer':
        return "We'll answer all your questions soon!";
      default:
        return "We'll get back to you within 24-48 hours.";
    }
  };

  const getTrustIndicators = () => {
    switch (visitorType) {
      case 'action-taker':
        return [
          { icon: Zap, text: "Fast response guaranteed" },
          { icon: Users, text: "Direct team access" },
        ];
      case 'comparer':
        return [
          { icon: CheckCircle2, text: "Detailed answers" },
          { icon: Clock, text: "48h response time" },
        ];
      case 'explorer':
        return [
          { icon: HelpCircle, text: "No question too small" },
          { icon: CheckCircle2, text: "Friendly support" },
        ];
      default:
        return [
          { icon: Clock, text: "24-48h response" },
        ];
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 md:py-28 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl mx-auto shadow-card border-border/50 bg-card">
              <CardContent className="pt-12 pb-12 text-center space-y-6">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl font-bold">
                    {visitorType === 'action-taker' ? "We're On It!" : "Thank You!"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {getSuccessMessage()}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  const trustIndicators = getTrustIndicators();

  return (
    <section id="contact" className="py-20 md:py-28 bg-card/50">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={visitorType + '-contact-header'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4 mb-12"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 font-medium px-4 py-1.5">
              <Mail className="w-3.5 h-3.5 mr-2" />
              {isReturningVisitor ? "Welcome Back" : "Get In Touch"}
            </Badge>
            <h2 className="font-heading text-3xl lg:text-title">
              {content.contactHeadline.split(' ').map((word, i, arr) => 
                i === arr.length - 1 ? (
                  <span key={i} className="text-gradient-brand">{word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {content.contactSubheadline}
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <indicator.icon className="w-4 h-4 text-primary" />
                  <span>{indicator.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="max-w-2xl mx-auto shadow-card border-border/50 bg-card hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-heading text-xl">
                {visitorType === 'action-taker' ? "Let's Make It Happen" : "Send Us a Message"}
              </CardTitle>
              <CardDescription>
                {engagementLevel === 'high' 
                  ? "We've noticed you're really engaged — let's connect!"
                  : "Fill out the form below and we'll respond promptly"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inquiry Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="w-4 h-4 text-muted-foreground" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={visitorType === 'action-taker' 
                              ? "Partnership opportunity" 
                              : "Brief description of your inquiry"
                            }
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={visitorType === 'comparer' 
                              ? "Tell us what features you'd like to know more about..."
                              : "Tell us more about your inquiry..."
                            }
                            rows={5}
                            {...field}
                            className="bg-background resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-hero hover:opacity-90 shadow-primary font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {content.contactCTA}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
