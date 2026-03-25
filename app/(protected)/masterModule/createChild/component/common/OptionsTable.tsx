import {
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export const OptionsTable = ({ form, fields, append, remove }: any) => {
    return (<div className="space-y-4">

        {/* HEADER */}
        {
            fields.length > 0 ? (<div className="grid grid-cols-[1fr_1fr_60px] text-sm font-medium text-gray-600 px-2">
                <div>Database Value *</div>
                <div>Label Text *</div>
                <div></div>
            </div>) : ""
        }


        {/* BODY */}
        <div className="max-h-[260px] overflow-y-auto">
            {fields.map((item: any, index: number) => (
                <div
                    key={item.id}
                    className="grid grid-cols-[1fr_1fr_60px] gap-1 items-start  pr-3 pl-3 rounded-lg  transition"
                >
                    {/* VALUE */}
                    <FormField
                        control={form.control}
                        name={`options.${index}.option_value`}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Database value"
                                        {...field}
                                        className={cn(
                                            "bg-white",
                                            fieldState.error && "border-red-500"
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* LABEL */}
                    <FormField
                        control={form.control}
                        name={`options.${index}.option_label`}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Label text"
                                        {...field}
                                        className={cn(
                                            "bg-white",
                                            fieldState.error && "border-red-500"
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* DELETE */}
                    <div className="flex justify-center mt-1">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                            className="h-9 w-9 p-0"
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-end">
            <Button
                type="button"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => append({ option_value: "", option_label: "" })}
            >
                Add New Key
            </Button>
        </div>

    </div>

    );
};
