import { useState } from "react";
import { Check } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function SheetPicker({ value, options, onChange, label, triggerClassName }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className={triggerClassName} aria-haspopup="dialog">
          {current?.label || value}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl px-3 pb-6 pt-3">
        <SheetHeader className="text-left">
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <div className="mt-2 space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted text-foreground"
            >
              <span className="text-sm font-medium">{o.label}</span>
              {o.value === value && <Check size={16} className="text-primary" />}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}