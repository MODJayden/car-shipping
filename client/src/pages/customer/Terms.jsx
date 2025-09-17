import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Shield, FileText, Truck, ChevronRight } from "lucide-react";

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Legal Information
          </h1>
          <p className="text-lg text-muted-foreground">
            Review our policies to understand how we operate and protect your
            information
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms of Service
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping Policy
            </TabsTrigger>
          </TabsList>

          {/* Terms of Service */}
          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
                <CardDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    1. Agreement to Terms
                  </h2>
                  <p className="text-muted-foreground">
                    By accessing or using AutoAuction's website and services,
                    you agree to be bound by these Terms of Service. If you
                    disagree with any part of the terms, you may not access our
                    services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    2. User Accounts
                  </h2>
                  <p className="text-muted-foreground">
                    When you create an account with us, you must provide
                    accurate and complete information. You are responsible for
                    safeguarding your password and for any activities under your
                    account.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    3. Vehicle Listings
                  </h2>
                  <p className="text-muted-foreground">
                    All vehicles listed on our platform are described as
                    accurately as possible. However, we do not guarantee the
                    accuracy of all information provided by sellers. Buyers are
                    encouraged to inspect vehicles personally or use third-party
                    inspection services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    4. Purchases and Payment
                  </h2>
                  <p className="text-muted-foreground">
                    All purchases are subject to availability. We reserve the
                    right to refuse or cancel any order. Prices are subject to
                    change without notice. Buyers are responsible for all
                    applicable taxes and fees.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    5. Auction Process
                  </h2>
                  <p className="text-muted-foreground">
                    Our auction process follows specific guidelines. By placing
                    a bid, you enter into a legally binding contract to purchase
                    the vehicle if you are the winning bidder, subject to the
                    seller's reserve price being met.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    6. Intellectual Property
                  </h2>
                  <p className="text-muted-foreground">
                    The Service and its original content, features, and
                    functionality are owned by AutoAuction and are protected by
                    international copyright, trademark, patent, trade secret,
                    and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    7. Termination
                  </h2>
                  <p className="text-muted-foreground">
                    We may terminate or suspend your account immediately,
                    without prior notice or liability, for any reason
                    whatsoever, including without limitation if you breach the
                    Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    8. Governing Law
                  </h2>
                  <p className="text-muted-foreground">
                    These Terms shall be governed by and construed in accordance
                    with the laws of the state where our company is registered,
                    without regard to its conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    9. Changes to Terms
                  </h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify or replace these Terms at any
                    time. We will provide notice of significant changes through
                    our website or via email.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    10. Contact Information
                  </h2>
                  <p className="text-muted-foreground">
                    For any questions about these Terms, please contact us at
                    legal@autoauction.com.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Policy */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    1. Information We Collect
                  </h2>
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us, including
                    when you create an account, participate in auctions, or
                    contact us. This may include:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>
                      Personal identification information (name, email, phone
                      number, etc.)
                    </li>
                    <li>
                      Payment information (processed securely by our payment
                      partners)
                    </li>
                    <li>Vehicle information for listings</li>
                    <li>Communications with us</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Detect and prevent fraudulent transactions</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    3. Information Sharing
                  </h2>
                  <p className="text-muted-foreground">
                    We do not sell your personal information. We may share
                    information with:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>
                      Service providers who perform services on our behalf
                    </li>
                    <li>
                      Professional advisors (lawyers, bankers, auditors, etc.)
                    </li>
                    <li>
                      Law enforcement or government agencies when required by
                      law
                    </li>
                    <li>
                      Other parties in connection with a merger or acquisition
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    4. Cookies and Tracking Technologies
                  </h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar tracking technologies to track
                    activity on our service and hold certain information to
                    improve user experience.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    5. Data Security
                  </h2>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your
                    personal information. However, no method of transmission
                    over the Internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    6. Your Rights
                  </h2>
                  <p className="text-muted-foreground">
                    Depending on your location, you may have rights regarding
                    your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>
                      Accessing and receiving a copy of your personal data
                    </li>
                    <li>Rectifying inaccurate or incomplete data</li>
                    <li>Requesting erasure of your personal data</li>
                    <li>Restricting processing of your personal data</li>
                    <li>Data portability</li>
                    <li>Objecting to processing</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    7. Children's Privacy
                  </h2>
                  <p className="text-muted-foreground">
                    Our service is not intended for children under 18. We do not
                    knowingly collect personal information from children under
                    18.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    8. Changes to This Policy
                  </h2>
                  <p className="text-muted-foreground">
                    We may update our Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please
                    contact us at privacy@autoauction.com.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Policy */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Policy</CardTitle>
                <CardDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    1. Shipping Services
                  </h2>
                  <p className="text-muted-foreground">
                    AutoAuction partners with reputable shipping companies to
                    provide vehicle transportation services. We offer both
                    domestic and international shipping options for purchased
                    vehicles.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    2. Shipping Process
                  </h2>
                  <p className="text-muted-foreground">
                    After a successful purchase, our team will contact you
                    within 2 business days to arrange shipping. The process
                    typically includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>Vehicle inspection and documentation preparation</li>
                    <li>Coordination with shipping providers</li>
                    <li>Customs clearance for international shipments</li>
                    <li>Delivery scheduling</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    3. Shipping Costs
                  </h2>
                  <p className="text-muted-foreground">
                    Shipping costs are calculated based on:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>Distance from pickup to delivery location</li>
                    <li>Vehicle size and type</li>
                    <li>Shipping method (open vs. enclosed transport)</li>
                    <li>
                      International customs fees and taxes (if applicable)
                    </li>
                    <li>Expedited shipping options</li>
                  </ul>
                  <p className="mt-4 text-muted-foreground">
                    A detailed shipping quote will be provided before finalizing
                    the shipping arrangement.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    4. Delivery Timeframes
                  </h2>
                  <p className="text-muted-foreground">
                    Delivery timeframes vary based on distance and shipping
                    method:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>Domestic shipments: 5-14 business days</li>
                    <li>International shipments: 2-6 weeks</li>
                  </ul>
                  <p className="mt-4 text-muted-foreground">
                    These are estimates and may be affected by weather, customs
                    processing, or other unforeseen circumstances.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    5. Vehicle Inspection Upon Delivery
                  </h2>
                  <p className="text-muted-foreground">
                    We strongly recommend inspecting the vehicle upon delivery.
                    Note any damages or discrepancies on the bill of lading
                    before signing. Take photos as evidence if needed.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    6. Shipping Insurance
                  </h2>
                  <p className="text-muted-foreground">
                    All vehicles are insured during transit against damage or
                    loss. The insurance coverage includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>Accidental damage during loading/unloading</li>
                    <li>Transportation accidents</li>
                    <li>Theft during transit</li>
                    <li>Natural disasters</li>
                  </ul>
                  <p className="mt-4 text-muted-foreground">
                    Additional insurance options are available for high-value
                    vehicles.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    7. International Shipping
                  </h2>
                  <p className="text-muted-foreground">
                    For international shipments, buyers are responsible for:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                    <li>All import duties and taxes</li>
                    <li>Customs clearance documentation</li>
                    <li>
                      Compliance with destination country's vehicle regulations
                    </li>
                    <li>Any modifications required for legal compliance</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    8. Cancellation and Changes
                  </h2>
                  <p className="text-muted-foreground">
                    Shipping arrangements can be modified or canceled up to 24
                    hours before the scheduled pickup. Cancellation fees may
                    apply based on costs already incurred.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    9. Problem Resolution
                  </h2>
                  <p className="text-muted-foreground">
                    If issues arise during shipping, contact our support team
                    immediately at shipping@autoauction.com. We will work with
                    the shipping provider to resolve any problems.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    10. Contact Information
                  </h2>
                  <p className="text-muted-foreground">
                    For shipping-related questions, please contact our shipping
                    department at shuqranllc@gmail.com or call +1 (347)
                    403-7275.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LegalPage;
