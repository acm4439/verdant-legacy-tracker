import { MapPin, Phone, Mail, Clock, Send, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenity-cream to-memorial-gold/10">
      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-forest-green mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            We’re here to help. Reach out for inquiries about lots, services, or to schedule a visit.
          </p>
        </div>

        {/* Intro / About */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-forest-green">About Our Memorial Park</CardTitle>
            <CardDescription>
              A peaceful memorial park thoughtfully designed to honor loved ones with dignity, serenity, and care.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 leading-relaxed">
            <p>
              Our grounds are planned to provide families with a tranquil space for remembrance — combining natural landscapes,
              well-maintained gardens, and thoughtfully laid-out sections for every type of memorial need.
            </p>
            <p>
              Each memorial park can customize this information with their own history, location details, and unique features to
              help visitors understand what makes their park special.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-forest-green">Get in Touch</CardTitle>
              <CardDescription>Funeral service & cemetery contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-forest-green mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    Please contact us for the exact address and directions for your memorial park location.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-forest-green mt-1" />
                <div>
                  <p className="font-medium">Mobile</p>
                  <p className="text-sm text-muted-foreground">
                    Add your park&apos;s primary contact number here for inquiries and assistance.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-forest-green mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    info@memorialpark.com (update this to your park&apos;s official email address)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-forest-green mt-1" />
                <div>
                  <p className="font-medium">Office Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Typical hours: Mon–Sat, 8:00 AM – 5:00 PM (adjust based on your memorial park schedule).
                  </p>
                </div>
              </div>
              <div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm text-forest-green underline hover:opacity-80"
                >
                  View location in Google Maps
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-forest-green">Send us a message</CardTitle>
              <CardDescription>We’ll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                  Thank you! Your message has been sent.
                </div>
              ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" rows={6} required />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Contact;

