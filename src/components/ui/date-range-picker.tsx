"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fns } from "@/lib/date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  onChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  value?: DateRange;
}

export function DateRangePicker({
  className,
  onChange,
  placeholder,
  value,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {fns.format(value.from, "dd LLL. y")} -{" "}
                  {fns.format(value.to, "dd LLL. y")}
                </>
              ) : (
                fns.format(value.from, "dd LLL. y")
              )
            ) : (
              <span>{placeholder ?? "Escolha uma data"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            initialFocus
            mode="range"
            selected={value}
            numberOfMonths={2}
            // eslint-disable-next-line react/jsx-handler-names
            onSelect={onChange}
            defaultMonth={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
