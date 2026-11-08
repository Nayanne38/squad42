import { ChevronRight } from "lucide-react";
import { mockGroups } from "@/data/shared/social";

export function GroupCard({ group }: { group: (typeof mockGroups)[number] }) {
  return <button className="group-card"><div className={`group-icon ${group.color}`}>{group.icon}</div><div><b>{group.title}</b><small>{group.subject}</small><span>{group.members}</span></div><ChevronRight /></button>;
}
