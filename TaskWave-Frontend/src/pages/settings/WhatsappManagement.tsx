import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWhatsapp } from "@/contexts/WhatsappContext"; // Import the context
import { useAuth } from "@/contexts/AuthContext"; // Import the context
import { set } from "date-fns";
import { useToast } from "@/components/ui/use-toast"; // Adjust path if necessary
import { Description } from "@radix-ui/react-toast";


const WhatsappManagement: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Use the Auth context for authentication
  const { updatewhatsapp, addWhatsapp, loading, error, fetchWhatsapp } = useWhatsapp(); // Use the context
  const [whatsappData, setWhatsappData] = useState({
    number: "",
    token: "",
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState(false); // Track if it's an update operation

  useEffect(() => {
    const loadWhatsappInfo = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const whatsappInfo = await fetchWhatsapp();
        console.log("Fetched WhatsApp info on page:", whatsappInfo);
        if (whatsappInfo) {
          setWhatsappData({
            number: whatsappInfo.number || "",
            token: whatsappInfo.token || "",
          });
          setIsUpdate(true); // Set to update mode if data exists
        } else {
          setIsUpdate(false); // Set to create mode if no data exists
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching WhatsApp info:", err);
          setFetchError(err.message || "Failed to load WhatsApp info.");
        } else {
          console.error("Unexpected error:", err);
          setFetchError("An unexpected error occurred.");
        }
        console.error("Error fetching WhatsApp info:", err);
        setFetchError(err.message || "Failed to load WhatsApp info.");
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated) {
      loadWhatsappInfo();
    }
  }, [fetchWhatsapp, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWhatsappData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    // Prepare the payload
    const payload = {
      number: whatsappData.number,
      token: whatsappData.token,
    };

    const success = await updatewhatsapp(payload);
    console.log("Update function returned:", success);
    if (success) {
      console.log("WhatsApp data updated successfully!", success);
      setWhatsappData({
        number: success.number || "",
        token: success.token || "",
      });
      toast({ title: "successful", description: "Whatsappinfo updated successfully"});
    } else {
      toast({title:"Failed", description: "Failed to update WhatsApp data", variant: "destructive"});
    }
  };

  const handleSave = async () => {
    // Prepare the payload
    const payload = {
      number: whatsappData.number,
      token: whatsappData.token,
    };

    // Call the addWhatsapp function from the context
    const success = await addWhatsapp(payload);

    if (success) {
      toast({ title: "successful", description: "Whatsappinfo saved successfully"});
    } else {
      toast({title:"Failed", description: "Failed to save WhatsApp data", variant: "destructive"});
    }
  };

  return (
    <div>
      <h2>Whatsapp Management</h2>
      {isLoading ? (
        <p>Loading WhatsApp information...</p>
      ) : fetchError ? (
        <p className="text-red-500">Error: {fetchError}</p>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="number">WhatsApp NumberId</Label>
            <Input
              type="text"
              id="number"
              name="number"
              value={whatsappData.number}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="token">WhatsApp Token</Label>
            <Input
              type="password"
              id="token"
              name="token"
              value={whatsappData.token}
              onChange={handleInputChange}
            />
          </div>
          {!isUpdate ? (
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default WhatsappManagement;
