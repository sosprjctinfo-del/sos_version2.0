import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SOSButton from "@/components/SOSButton";
import ConfirmationModal from "@/components/ConfirmationModal";
import SendOptionsModal from "@/components/SendOptionsModal";
import StatusMessage from "@/components/StatusMessage";
import { getContacts } from "@/utils/storage";
import { getCurrentLocation, LocationResult } from "@/utils/location";
import { playAlertSound } from "@/utils/sms";

const Home = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [status, setStatus] = useState<{ type: "info" | "success" | "error" | "loading"; message: string } | null>(null);
  const [location, setLocation] = useState<LocationResult | null>(null);

  const handleSOSPress = () => setConfirmOpen(true);

  const handleConfirm = useCallback(async () => {
    setConfirmOpen(false);

    const contacts = getContacts();
    if (contacts.length === 0) {
      setStatus({ type: "error", message: "Please add at least one emergency contact" });
      return;
    }

    setStatus({ type: "loading", message: "Fetching your location…" });

    try {
      playAlertSound();
      const loc = await getCurrentLocation();
      setLocation(loc);
      setStatus({ type: "success", message: "Location acquired! Choose how to send." });
      setSendOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to fetch location";
      setStatus({ type: "error", message });
    }
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-full max-w-sm flex-1"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Emergency <span className="text-primary">SOS</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Press the button to send your location
          </p>
        </div>

        {/* SOS Button */}
        <div className="flex-1 flex items-center justify-center w-full">
          <SOSButton onClick={handleSOSPress} />
        </div>

        {/* Status */}
        <div className="w-full min-h-[52px]">
          {status && <StatusMessage type={status.type} message={status.message} visible />}
        </div>
      </motion.div>

      {/* Modals */}
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Send SOS Alert?"
        message="Are you sure you want to send your emergency location to your saved contact?"
      />

      {location && (
        <SendOptionsModal
          open={sendOpen}
          onClose={() => setSendOpen(false)}
          contacts={getContacts()}
          mapsLink={location.mapsLink}
        />
      )}
    </div>
  );
};

export default Home;
