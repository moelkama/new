import { Button } from "@/components/shadcn/ui/button";
import { ChevronUp, SlidersHorizontal } from "lucide-react";
import React from "react";

const Filters = () => {
  // This is a placeholder until the backend implementation is ready
  return (
    <Button variant="outline" className="border-brand-main gap-2 bg-white">
      <SlidersHorizontal className="h-4 w-4" />
      Filters
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D2F1F2] p-0">
        <ChevronUp className="text-brand-main h-4 w-4" />
      </div>
    </Button>
  );
};

export default Filters;
