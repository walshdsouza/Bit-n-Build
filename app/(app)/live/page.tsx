import type { Metadata } from "next";
import LiveMeeting from "@/components/live/LiveMeeting";

export const metadata: Metadata = { title: "Live meetings" };

export default function LivePage() {
  return <LiveMeeting />;
}
