import React from "react";
import {
  Users,
  Award,
  Target,
  Heart,
  Shield,
  TrendingUp,
  Car,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import image from "../../assets/owner.jpg"



const AboutUs = () => {
  const teamMembers = [
    {
      name: "Abass Abubakar",
      role: "CEO & Founder",
      image:
        image,
      bio: "With over 15 years in the automotive industry, Abass founded AutoAuction to revolutionize car buying.",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
     
        
      bio: "Michael ensures our auctions run smoothly and our customers have the best experience possible.",
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Director",
     
      bio: "Elena connects car enthusiasts with their dream vehicles through innovative marketing strategies.",
    },
    {
      name: "David Kim",
      role: "Lead Automotive Expert",
      
      bio: "David's expertise ensures every vehicle meets our rigorous quality standards before auction.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Vehicles Sold" },
    { value: "50+", label: "Countries Served" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "15M+", label: "In Sales" },
  ];

  const values = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Trust & Transparency",
      description:
        "We believe in honest dealings and clear communication throughout the auction process.",
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Customer Passion",
      description:
        "Our customers are at the heart of everything we do. Your satisfaction is our success.",
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: "Excellence",
      description:
        "We strive for excellence in vehicle quality, service, and overall experience.",
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Innovation",
      description:
        "Continuously improving our platform to make car buying simpler and more enjoyable.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM1MTUxNTEiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-blue-500/30">
              About AutoAuction
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Revolutionizing Car Auctions
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              We connect car enthusiasts with their dream vehicles through
              transparent, exciting auctions and reliable shipping services
              worldwide.
            </p>
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Explore Our Auctions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2015, AutoAuction began with a simple mission: to
                make premium vehicles accessible to everyone through a
                transparent auction process. What started as a small local
                operation has grown into a global platform serving thousands of
                customers worldwide.
              </p>
              <p className="text-muted-foreground mb-4">
                Our journey began when our founder, Abass Abubakar, noticed how
                difficult it was for people to find quality used vehicles at
                fair prices. Traditional dealerships often had hidden fees, and
                private sales came with risks. She envisioned a platform where
                buyers and sellers could connect directly in a fair, exciting
                auction environment.
              </p>
              <p className="text-muted-foreground">
                Today, we're proud to have facilitated over 10,000 vehicle sales
                and expanded our services to include international shipping,
                financing options, and vehicle inspections. Our commitment to
                excellence remains unchanged since day one.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="AutoAuction team discussing"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">
              These core principles guide everything we do at AutoAuction and
              shape our company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg bg-background"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground">
              Our dedicated team of automotive enthusiasts and technology
              experts work together to deliver exceptional auction experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <CardDescription>{member.bio}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-gray-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Join thousands of satisfied customers who've found their perfect
            vehicle through our auctions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-black dark:white hover:bg-gray-100"
            >
              Browse Auctions
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about our auctions or need assistance? Our team
                is here to help you every step of the way.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-full text-primary mr-4">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (347) 403-7275</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-full text-primary mr-4">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      shuqranllc@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-full text-primary mr-4">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      963 Woodycrest ave #22b Bronx, NY 10452
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-full text-primary mr-4">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-muted-foreground">
                      Mon-Fri: 9AM-6PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/*  <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    We'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows="4"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Your message..."
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
