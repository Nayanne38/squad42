import { ChevronRight } from "lucide-react";
import { mockHobbies } from "@/data/shared/social";

export function HobbyCard({ hobby }: { hobby: (typeof mockHobbies)[number] }) {
  return <div className={`social-card hobby-card ${hobby.color}`}><span>{hobby.emoji}</span><h3>{hobby.title}</h3><p>{hobby.description}</p><button>Explorar <ChevronRight /></button></div>;
}
