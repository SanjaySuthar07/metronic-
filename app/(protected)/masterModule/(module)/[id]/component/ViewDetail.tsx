"use client";

import { useEffect, useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTable,
    CardTitle,
} from "@/components/ui/card";

import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { moduleDetailsApi } from "@/store/thunk/masterModule.thunk";
import { Badge } from "@/components/ui/badge";
import { removeModuleDetails } from "@/store/slice/masterModule.slice";
import { getColumnTypes, getAllModels } from "@/store/thunk/masterModule.thunk";

function View({ id }: { id: string }) {
    const dispatch = useDispatch() as any;
    const { moduleDetails } = useSelector((s: any) => s.masterModule);
        const { inputTypes, loading, inputModel } = useSelector((s: any) => s.masterModule);
    
      /* FETCH TYPES */
        useEffect(() => {
            dispatch(getColumnTypes());
            dispatch(getAllModels());
        }
        , [dispatch]);

    useEffect(() => {
        if (!id) return;
        if (!moduleDetails || moduleDetails.id !== Number(id)) {
            dispatch(moduleDetailsApi(id));
        }
    }, [id, dispatch, moduleDetails?.id]);

    const permissionList = [
        { id: 1, label: "Module Access" },
        { id: 2, label: "Module Create" },
        { id: 3, label: "Module Edit" },
        { id: 4, label: "Module Show" },
        { id: 5, label: "Module Delete" },
    ];

    const visibilityList = [
        { id: 1, label: "Create form" },
        { id: 2, label: "Edit form" },
        { id: 3, label: "Show page" },
        { id: 4, label: "Delete action" },
    ];

    const actionList = [
        { id: 1, label: "Create form" },
        { id: 2, label: "Edit form" },
        { id: 3, label: "Show page" },
        { id: 4, label: "Delete action" },
    ];

    // Render Permission Badges
    const renderPermissionBadges = (permissions: any[] = []) => {
        const map: any = { access: 1, create: 2, edit: 3, show: 4, delete: 5 };
        return permissions.map((p, index) => {
            const key = p.permission_name.split("_").pop();
            const idNum = map[key];
            const item = permissionList.find((i) => i.id === idNum);
            if (!item) return null;
            const variant = getBadgeVariant(item.label);
            return (
                <Badge key={index} variant={variant as any} appearance="light" className="mr-1 mb-1">
                    {item.label}
                </Badge>
            );
        });
    };

    // Top Data
    const data = useMemo(() => {
        if (!moduleDetails) return {};
        return {
            menuName: moduleDetails.main_model_name,
            menuIcon: "/images/module-icon.png",
            parentMenu: moduleDetails.parent_menu || "No Parent",
            status: moduleDetails.status ? "Active" : "Inactive",
            userType: moduleDetails.user_type,
            action: renderBadges(moduleDetails.actions, actionList),
            permissions: renderPermissionBadges(moduleDetails.permissions),
        };
    }, [moduleDetails]);

    const formatLabel = (key: string) =>
        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

    // Enhanced Options Display - Now shows in table-like row format
    const renderOptions = (field: any) => {
        if (!field.options?.length) return <span className="text-muted-foreground">-</span>;

        return (
            <div className="space-y-1 text-xs">
                <div className=" bg-muted/50 flex items-center  justify-between  px-2 py-1">
                    <span className="font-medium">Label</span>
                    <div className="flex items-center gap-2 font-medium">
                        <span >Value</span>
                    </div>
                </div>
                {field.options.map((opt: any, idx: number) => {
                    const isDefault =
                        field.default_value === opt.option_value ||
                        field.default_value === opt.option_label;

                    return (
                        <div
                            key={idx}
                            className="flex items-center justify-between  px-2 py-1"
                        >
                            <span className="font-normal">{opt.option_label}</span>
                            <div className="flex items-center gap-2">
                                <span >{opt.option_value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // All Fields with Enhanced Processing
    const allFields = useMemo(() => {
        if (!moduleDetails?.fields) return [];
        console.log("input types", moduleDetails?.fields);
        return moduleDetails.fields.map((field: any) => {
            const isChecked = field.default_value?.toLowerCase() === "checked" ||
                field.default_value === true;
            return {
                type: inputTypes.find((t: any) => t.id === field.column_type_id)?.name || "Unknown",
                database_column: field.db_column,
                label: field.label,
                validation: field.validation || "-",
                tooltip_text: field.tooltip_text || "-",
                default_value: field.default_value || "-",
                options: renderOptions(field),        // ← Updated here
                isChecked,
                visibility: renderBadges(field.visibility, visibilityList),
            };
        });
    }, [moduleDetails]);

    // Filter Fields
    const radioFields = allFields.filter(f => f.type === "Radio");
    const selectFields = allFields.filter(f => f.type === "Select");
    const checkboxFields = allFields.filter(f => f.type === "Checkbox");
    const fileFields = allFields.filter(f => f.type === "File" || f.type === "Photo");
    const generalFields = allFields.filter(f =>
        !["Radio", "Select", "Checkbox", "File", "Photo"].includes(f.type)
    );

    // Professional Columns
    const fieldColumns: ColumnDef<any>[] = useMemo(() => [
        { accessorKey: "type", header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />, size: 110 },
        { accessorKey: "database_column", header: ({ column }) => <DataGridColumnHeader title="Database Column" column={column} />, size: 160 },
        { accessorKey: "label", header: ({ column }) => <DataGridColumnHeader title="Label" column={column} />, size: 160 },
        { accessorKey: "validation", header: ({ column }) => <DataGridColumnHeader title="Validation" column={column} />, size: 120 },
        {
            accessorKey: "default_value",
            header: ({ column }) => <DataGridColumnHeader title="Default Value" column={column} />,
            size: 140
        },
        {
            accessorKey: "options",
            header: ({ column }) => <DataGridColumnHeader title="Options" column={column} />,
            size: 320,                    // Increased size for better readability
            cell: ({ row }) => (
                <div className="py-1">
                    {row.original.options}
                </div>
            ),
        },
        {
            accessorKey: "tooltip_text",
            header: ({ column }) => <DataGridColumnHeader title="Tooltip" column={column} />,
            size: 160
        },
        {
            accessorKey: "visibility",
            header: ({ column }) => <DataGridColumnHeader title="Visibility" column={column} />,
            size: 220,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.visibility}
                </div>
            ),
        }
    ], []);

    // Tables
    const generalTable = useReactTable({ columns: fieldColumns, data: generalFields, getCoreRowModel: getCoreRowModel() });
    const radioTable = useReactTable({ columns: fieldColumns, data: radioFields, getCoreRowModel: getCoreRowModel() });
    const selectTable = useReactTable({ columns: fieldColumns, data: selectFields, getCoreRowModel: getCoreRowModel() });
    const checkboxTable = useReactTable({ columns: fieldColumns, data: checkboxFields, getCoreRowModel: getCoreRowModel() });
    const fileTable = useReactTable({ columns: fieldColumns, data: fileFields, getCoreRowModel: getCoreRowModel() });

    return (
        <>
            <Card>
                <CardContent>
                    <h3 className="font-semibold mb-3">View Modules</h3>
                    <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm mb-5 [&_dt]:text-muted-foreground">
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-subgrid col-span-2 items-center">
                                <dt className="md:w-64">{formatLabel(key)}:</dt>
                                <dd className="flex items-center gap-2.5">
                                    {key === "menuIcon" ? (
                                        <Image src={value as string} alt="icon" width={30} height={30} className="rounded" />
                                    ) : (
                                        value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </CardContent>
            </Card>

            {/* General Fields */}
            {generalFields.length > 0 && (
                <DataGrid table={generalTable} recordCount={generalFields.length}>
                    <Card className="mt-4">
                        <CardHeader><CardTitle>Fields</CardTitle></CardHeader>
                        <CardTable>
                            <ScrollArea>
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardTable>
                    </Card>
                </DataGrid>
            )}

            {/* Radio */}
            {radioFields.length > 0 && (
                <DataGrid table={radioTable} recordCount={radioFields.length}>
                    <Card className="mt-4">
                        <CardHeader><CardTitle>Radio</CardTitle></CardHeader>
                        <CardTable>
                            <ScrollArea>
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardTable>
                    </Card>
                </DataGrid>
            )}

            {/* Select */}
            {selectFields.length > 0 && (
                <DataGrid table={selectTable} recordCount={selectFields.length}>
                    <Card className="mt-4">
                        <CardHeader><CardTitle>Select</CardTitle></CardHeader>
                        <CardTable>
                            <ScrollArea>
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardTable>
                    </Card>
                </DataGrid>
            )}

            {/* Checkbox & File Side by Side */}
            {checkboxFields.length > 0 && (
                <DataGrid table={checkboxTable} recordCount={checkboxFields.length}>
                    <Card className="mt-4">
                        <CardHeader><CardTitle>Checkbox</CardTitle></CardHeader>
                        <CardTable>
                            <ScrollArea>
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardTable>
                    </Card>
                </DataGrid>
            )}

            {fileFields.length > 0 && (
                <DataGrid table={fileTable} recordCount={fileFields.length}>
                    <Card className="mt-4">
                        <CardHeader><CardTitle>File / Photo</CardTitle></CardHeader>
                        <CardTable>
                            <ScrollArea>
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardTable>
                    </Card>
                </DataGrid>
            )}
        </>
    );
}

export default View;

// ==================== Helper Functions ====================
const renderBadges = (ids: number[] = [], list: any[]) => {
    return ids?.map((id) => {
        const item = list.find((i) => i.id === id);
        if (!item) return null;
        const variant = getBadgeVariant(item.label);
        return (
            <Badge key={id} variant={variant as any} appearance="light" className="mr-1 mb-1">
                {item.label}
            </Badge>
        );
    });
};

const getBadgeVariant = (label: string) => {
    const text = label.toLowerCase();
    if (text.includes("delete")) return "destructive";
    if (text.includes("edit")) return "success";
    if (text.includes("show") || text.includes("view")) return "info";
    if (text.includes("create")) return "primary";
    return "secondary";
};