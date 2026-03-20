import { registerPlugin } from "@capacitor/core";

type EmergencyContactPlugin = {
  setPhone: (options: { phone: string }) => Promise<{ ok: boolean }>;
  getPhone: () => Promise<{ phone: string }>;
};

const EmergencyContact = registerPlugin<EmergencyContactPlugin>("EmergencyContact");

export const setNativeEmergencyPhone = async (phone: string) => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  await EmergencyContact.setPhone({ phone });
};

export const getNativeEmergencyPhone = async (): Promise<string> => {
  if (!window.Capacitor?.isNativePlatform?.()) return "";
  const res = await EmergencyContact.getPhone();
  return res.phone ?? "";
};
