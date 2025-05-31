import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
// Removed direct apiClient import as we use the service
// import apiClient from '../api/axiosConfig';
import { AxiosError } from 'axios';

// --- Import the project service ---
import { whatsappService } from '../services/whatsappService';

// 1. Define the Project type based on your API response (ProjectResource)
// Ensure this matches the interface in apiService.ts and your API response


interface Whatsappinfo{
  number: string;
  token: string;
}

type NewWhatsappPayload = Omit<Whatsappinfo, 'id' | 'created_at' | 'updated_at' | 'user_id'> & {
  user_id?: number; // Optional if not required for creation
};
// Removed PaginatedResponse interface - projectService handles extraction

// 2. Define the shape of the context data

interface WhatsappContextType {
  whatsapp: Whatsappinfo | null;
  loading: boolean;
  error: string | null;
  fetchWhatsapp: () => Promise<Whatsappinfo[]>;
  addWhatsapp: (payload: NewWhatsappPayload) => Promise<Whatsappinfo | null>; // <-- Add addProject signature
  updatewhatsapp: (payload: NewWhatsappPayload) => Promise<Whatsappinfo | null>; // <-- Add updatewhatsapp signature
}
// 3. Create the Context
const WhatsAppContext = createContext<WhatsappContextType | null>(null);

// 4. Create the Provider Component

interface WhatsappProviderProps {
  children: ReactNode;
}

export const WhatsappProvider: React.FC<WhatsappProviderProps> = ({ children }) => {
  const [whatsapp, setWhatsappData] = useState<Whatsappinfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const addwhatsapp = useCallback(async (payload: NewWhatsappPayload): Promise<Whatsappinfo | null> => {
    setLoading(true); // Indicate loading state
    setError(null);
    try {
      // Use the service function to create the project via API
      console.log("Adding whatsapp via API:", payload);
      const NewWhatsapp = await whatsappService.createwhatsapp(payload);
      console.log("whatsapp created via API:", NewWhatsapp);

     const whatsappinfo =  await whatsappService.getwhatsappinfo(); // Fetch updated whatsapp info after creation
      // Ensure NewWhatsapp matches the Whatsappinfo type
      if (whatsappinfo) {
        return whatsappinfo; // Explicitly cast to Whatsappinfo
      } else {
        throw new Error("Invalid response: Missing required Whatsappinfo properties.");
      }
    } catch (error) {
      const err = error as AxiosError | Error;
      console.error("Failed to add project via context:", err.message);
      setError("Failed to add project."); // Set error state in context
      // Optionally parse and return specific validation errors
      return null; // Indicate failure
    } finally {
      setLoading(false); // Reset loading state
    }
  }, []); // Depend on fetchProjects to ensure it is up-to-date

  //add a method to update whatsapp info
  const updatewhatsapp = useCallback(async (payload: NewWhatsappPayload): Promise<Whatsappinfo | null> => {
    setLoading(true); // Indicate loading state
    setError(null);
    try {
      // Use the service function to create the project via API
      console.log("Updating whatsapp via API:", payload);
      const NewWhatsapp = await whatsappService.updatewhatsapp(payload);
      console.log("whatsapp updated via API:", NewWhatsapp);

     const whatsappinfo =  await whatsappService.getwhatsappinfo();
     console.log("äfter updation", whatsappinfo) // Fetch updated whatsapp info after creation
      // Ensure NewWhatsapp matches the Whatsappinfo type
      if (whatsappinfo) {
        return whatsappinfo; // Explicitly cast to Whatsappinfo
      } else {
        throw new Error("Invalid response: Missing required Whatsappinfo properties.");
      }
    } catch (error) {
      const err = error as AxiosError | Error;
      console.error("Failed to add project via context:", err.message);
      setError("Failed to add project."); // Set error state in context
      // Optionally parse and return specific validation errors
      return null; // Indicate failure
    } finally {
      setLoading(false); // Reset loading state
    }
  }, []); // Close the updatewhatsapp function
  //add a method to fetch whatsapp info
  const fetchWhatsapp = useCallback(async (): Promise<Whatsappinfo> => {
    setLoading(true); // Indicate loading state
    setError(null);
    try {
      const response = await whatsappService.getwhatsappinfo();
      console.log('Whatsapp info fetched:', response);
      setWhatsappData(response); // Set the fetched data to state
      return response; // Return the fetched data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Failed to fetch whatsapp info:', axiosError.response?.data || axiosError.message);
      setError('Failed to fetch whatsapp info.'); // Set error state in context
      throw error; // Re-throw to be handled by caller
    } finally {
      setLoading(false); // Reset loading state
    }
  }
  , []); // Empty dependency array to run only once
  // Fetch whatsapp info on component mount
  useEffect(() => {
    const loadWhatsappInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const whatsappInfo = await fetchWhatsapp();
        if (whatsappInfo && whatsappInfo.length > 0) {
          // Assuming the API returns an array, and you want the first element
          setWhatsappData(whatsappInfo);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching WhatsApp info:", err);
          setError(err.message || "Failed to load WhatsApp info.");
        } else {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadWhatsappInfo();
  }
  , [fetchWhatsapp]); // Depend on fetchWhatsapp to ensure it's up-to-date



  const value: WhatsappContextType = {
    whatsapp,
    loading,
    error,
    fetchWhatsapp: async () => {
      // Placeholder function, implement fetch logic if needed
      return whatsapp;
    },
    addWhatsapp: addwhatsapp,
    updatewhatsapp: updatewhatsapp,
  };

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsapp = (): WhatsappContextType => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsapp must be used within a WhatsappProvider');
  }
  return context;
};


// Removed whatsappService declaration from this file
