import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ShieldCheck, Info } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to register as a seller.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("sellers").insert({
        user_id: session.user.id,
        business_name: formData.businessName,
        description: formData.description,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          zipCode: formData.address.zipCode,
          country: formData.address.country,
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: "Your seller account is pending approval. We'll notify you once it's approved.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Store className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Business Information</h3>
            </div>
            <Input
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Business Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <Button onClick={() => setStep(2)} className="w-full">
              Next
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Info className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <Input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
            />
            <Input
              type="tel"
              name="contactPhone"
              placeholder="Contact Phone"
              value={formData.contactPhone}
              onChange={handleInputChange}
            />
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Next
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Business Address</h3>
            </div>
            <Input
              name="address.street"
              placeholder="Street Address"
              value={formData.address.street}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="address.city"
                placeholder="City"
                value={formData.address.city}
                onChange={handleInputChange}
                required
              />
              <Input
                name="address.state"
                placeholder="State"
                value={formData.address.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="address.zipCode"
                placeholder="ZIP Code"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                required
              />
              <Input
                name="address.country"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Become a Seller</CardTitle>
            <CardDescription>
              Join our marketplace and start selling your products to customers worldwide.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SellerRegistration;