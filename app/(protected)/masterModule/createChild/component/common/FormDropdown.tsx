'use client';

import React from "react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const FormDropdown = ({
    form,
    name,
    label,
    options,
    inputTypes,
    loading,
}: any) => {
    const [open, setOpen] = React.useState(false);
    const data = options || inputTypes || [];

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field, fieldState }) => (<FormItem className="space-y-1"> <FormLabel>
                {label} <span className="text-red-500">*</span> </FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                    "w-79 justify-between font-normal capitalize",
                                    !field.value && "text-muted-foreground",
                                    fieldState.error &&
                                    "border-red-500 focus-visible:ring-red-500"
                                )}
                            >
                                {field.value || `Select ${label}`}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0 w-79">
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    {data.map((item: any, index: number) => {
                                        const value = options ? item : item.name || item;

                                        return (
                                            <CommandItem
                                                key={index}
                                                onSelect={() => {
                                                    form.setValue(name, value, {
                                                        shouldValidate: true,
                                                    });
                                                    setOpen(false);
                                                }}
                                            >
                                                {value}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        field.value === value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <FormMessage />
            </FormItem>
            )}
        />

    );
};
