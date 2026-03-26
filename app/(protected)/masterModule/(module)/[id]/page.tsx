"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTable,
    CardTitle,
} from "@/components/ui/card";

import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import Image from "next/image";
import { DataGrid } from "@/components/ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { moduleDetailsApi } from "@/store/thunk/masterModule.thunk";
import { useParams } from "next/navigation";

function View() {
    const dispatch = useDispatch() as any;
    const params = useParams();
    const id = params?.id;

    const { moduleDetails } = useSelector((s: any) => s.masterModule);

    const [selectedRow, setSelectedRow] = useState<string | null>(null);

    // 🔥 FETCH DATA
    useEffect(() => {
        if (id) {
            dispatch(moduleDetailsApi(id));
        }
    }, []);

    const permissionList = [
        { id: 1, label: "Module Access" },
        { id: 2, label: "Module Create" },
        { id: 3, label: "Module Edit" },
        { id: 4, label: "Module Show" },
        { id: 5, label: "Module Delete" },
    ];
    const actionList = [
        { id: 1, label: "Create form" },
        { id: 2, label: "Edit form" },
        { id: 3, label: "Show page" },
        { id: 4, label: "Delete action" },
    ];
    const visibilityList = [
        { id: 1, label: "Create form" },
        { id: 2, label: "Edit form" },
        { id: 3, label: "Show page" },
        { id: 4, label: "Delete action" },
    ];
    const mapIdsToLabels = (ids: number[] = [], list: any[]) => {
        return ids
            .map((id) => list.find((item) => item.id === id)?.label)
            .filter(Boolean)
            .join(", ");
    };
    action: mapIdsToLabels(moduleDetails.actions, actionList) || "-"
    // 🔥 TOP DATA
    const data = useMemo(() => {
        if (!moduleDetails) return {};

        return {
            menuName: moduleDetails.main_model_name,
            menuIcon: "/images/module-icon.png",
            parentMenu: moduleDetails.parent_menu || "No Parent",
            status: moduleDetails.status ? "Active" : "Inactive",
            userType: moduleDetails.user_type,
            action: moduleDetails.actions?.join(", ") || "-",
            permissions:
                moduleDetails.permissions
                    ?.map((p: any) => p.permission_name)
                    .join(", ") || "-",

        };
    }, [moduleDetails]);

    // 🔥 FORMAT LABEL
    const formatLabel = (key: string) => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
    };

    // 🔥 FIELDS DATA
    const Filedsdata = useMemo(() => {
        if (!moduleDetails?.fields) return [];

        return moduleDetails.fields.map((field: any) => ({
            type: field.column_type?.name,
            database_column: field.db_column,
            label: field.label,
            validation: field.validation || "-",
            tooltip_text: field.tooltip_text || "-",
            visibility: field.visibility?.join(", ") || "-",
        }));
    }, [moduleDetails]);

    // 🔥 FIELDS COLUMNS (UNCHANGED)
    const Filedscolums = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "type",
                header: ({ column }) => (
                    <DataGridColumnHeader title="Type" column={column} />
                ),
            },
            {
                accessorKey: "database_column",
                header: ({ column }) => (
                    <DataGridColumnHeader title="Database Column" column={column} />
                ),
            },
            {
                accessorKey: "label",
                header: ({ column }) => (
                    <DataGridColumnHeader title="Label" column={column} />
                ),
            },
            {
                accessorKey: "validation",
                header: ({ column }) => (
                    <DataGridColumnHeader title="Validation" column={column} />
                ),
            },
            {
                accessorKey: "tooltip_text",
                header: ({ column }) => (
                    <DataGridColumnHeader title="Tooltip text" column={column} />
                ),
            },
            {
                accessorKey: "visibility",
                header: ({ column }) => (
                    <DataGridColumnHeader title="Visibility" column={column} />
                ),
            },
        ],
        [selectedRow]
    );

    const fieldstable = useReactTable({
        columns: Filedscolums,
        data: Filedsdata,
        getCoreRowModel: getCoreRowModel(),
    });

    // 🔥 EMPTY TABLES (AS IS)
    const emptyTable = useReactTable({
        columns: [],
        data: [],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Card>
                <CardContent>
                    <h3 className="font-semibold mb-3">View Modules</h3>

                    <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm mb-5 [&_dt]:text-muted-foreground">
                        {Object.entries(data).map(([key, value]) => (
                            <div
                                key={key}
                                className="grid grid-cols-subgrid col-span-2 items-center"
                            >
                                <dt className="md:w-64">{formatLabel(key)}:</dt>

                                <dd className="flex items-center gap-2.5">
                                    {key === "menuIcon" ? (
                                        <Image
                                            src={value as string}
                                            alt="icon"
                                            width={30}
                                            height={30}
                                            className="rounded"
                                        />
                                    ) : (
                                        value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </CardContent>
            </Card>

            {/* 🔥 FIELDS TABLE */}
            <DataGrid table={fieldstable} recordCount={0}>
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Fields</CardTitle>
                    </CardHeader>
                    <CardTable>
                        <ScrollArea>
                            <DataGridTable />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardTable>
                </Card>
            </DataGrid>

            {/* 🔥 EMPTY SECTIONS SAME DESIGN */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <DataGrid table={emptyTable} recordCount={0}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Radio</CardTitle>
                        </CardHeader>
                        <CardTable>
                            <DataGridTable />
                        </CardTable>
                    </Card>
                </DataGrid>

                <DataGrid table={emptyTable} recordCount={0}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Select</CardTitle>
                        </CardHeader>
                        <CardTable>
                            <ScrollArea>
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardTable>
                    </Card>
                </DataGrid>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <DataGrid table={emptyTable} recordCount={0}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Extra Options</CardTitle>
                        </CardHeader>
                        <CardTable>
                            <ScrollArea>
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardTable>
                    </Card>
                </DataGrid>
            </div>
        </>
    );
}

export default View;