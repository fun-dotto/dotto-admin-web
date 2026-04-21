"use client";

import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  detectCurrentEnvironment,
  environments,
  type EnvironmentKey,
} from "@/lib/environments";

export function EnvironmentSwitcher() {
  const [currentKey, setCurrentKey] = useState<EnvironmentKey>("local");

  useEffect(() => {
    setCurrentKey(detectCurrentEnvironment(window.location.origin));
  }, []);

  const handleChange = (next: string) => {
    const target = environments.find((env) => env.key === next);
    if (!target || !target.url) return;
    if (target.key === currentKey) return;

    const { pathname, search, hash } = window.location;
    window.location.href = `${target.url.replace(/\/$/, "")}${pathname}${search}${hash}`;
  };

  return (
    <Select value={currentKey} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue placeholder="環境を選択" />
      </SelectTrigger>
      <SelectContent>
        {environments.map((env) => (
          <SelectItem
            key={env.key}
            value={env.key}
            disabled={env.key !== "local" && !env.url}
          >
            {env.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
