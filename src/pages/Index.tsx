import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Leaf, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Leaf,
      title: "Natural Beauty",
      description: "Dramatic terrain and well-designed concept that competes with the most beautiful parks in the country."
    },
    {
      icon: Heart,
      title: "Caring Environment", 
      description: "A natural creation designed with creativity and ingenuity to care for your dearly departed loved ones."
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Unique top-soil mixture with natural drainage that significantly reduces floods and soil erosion."
    }
  ];

  const plotGardens = [
    { name: "Garden Lawn Lots", status: "Available", color: "bg-status-available" },
    { name: "Family Estate Chaplet", status: "Limited", color: "bg-memorial-gold" },
    { name: "Crematorium Niches", status: "Available", color: "bg-trust-blue" },
    { name: "Development Areas", status: "Coming Soon", color: "bg-status-development" }
  ];

  return (
    <div className="space-y-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/lovable-uploads/08438568-4a09-4980-b838-c4187b12e1f8.png)` }}
        >
          <div className="absolute inset-0 bg-forest-green-dark/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Forest Lawn
            <span className="block text-memorial-gold">Memorial Park</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-light">
            "Art and Nature... Peace and Beauty Eternally"
          </p>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Located in Rodriguez (formerly Montalban), Rizal. A serene resting place designed with 
            unparalleled beauty and lasting dignity for your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="memorial" className="text-lg px-8" asChild>
              <Link to="/dashboard">
                <MapPin className="w-5 h-5 mr-2" />
                Explore Available Lots
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-forest-green bg-white hover:bg-white/90">
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest-green mb-4">
              A Place of Peace and Dignity
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our memorial park combines natural beauty with thoughtful design to create 
              a peaceful environment that honors the memory of your loved ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-forest-green">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plot Gardens Section */}
      <section className="py-20 bg-serenity-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest-green mb-4">
              Themed Plot Gardens
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The park is divided into different plot gardens, each following specific themes 
              that align with our vision of eternal peace and beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plotGardens.map((garden, index) => (
              <Card key={index} className="hover:shadow-memorial transition-all duration-300">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${garden.color} rounded-lg mb-4`}></div>
                  <h3 className="font-bold text-forest-green mb-2">{garden.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Premium memorial lots with beautiful garden landscaping and peaceful ambiance.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      garden.status === 'Available' ? 'bg-status-available/20 text-status-available' :
                      garden.status === 'Limited' ? 'bg-memorial-gold/20 text-memorial-gold' :
                      'bg-status-development/20 text-status-development'
                    }`}>
                      {garden.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-forest-green mb-4">
                Visit Our Memorial Park
              </h2>
              <p className="text-xl text-muted-foreground">
                Located in the scenic hills of Rodriguez, Rizal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-forest-green" />
                    <span>Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Rodriguez (formerly Montalban), Rizal</p>
                  <Button variant="outline" className="w-full">
                    View on Google Maps
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-forest-green" />
                    <span>Visiting Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Monday - Sunday</p>
                  <p className="text-2xl font-bold text-forest-green">6:00 AM - 6:00 PM</p>
                  <p className="text-sm text-muted-foreground">Open daily for visits and consultations</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="memorial" className="text-lg px-12" asChild>
                <Link to="/dashboard">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Memorial Lots
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
