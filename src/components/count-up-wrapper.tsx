"use client";

import CountUp from "react-countup";

import { useEffect, useState } from "react";

interface CountUpWrapperProps {
  value: number;
}

export const CountUpWrapper = ({ value }: CountUpWrapperProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "-";

  return (
    <CountUp 
      preserveValue
      duration={0.5}
      end={value}
      decimals={0}
    />
  );
} 