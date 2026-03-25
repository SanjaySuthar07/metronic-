"use client";
import { use, useEffect, useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTable,
    CardTitle,
} from "@/components/ui/card";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    PaginationState,
    RowModel,
    Table,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { DataGrid } from "@/components/ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGridTable } from "@/components/ui/data-grid-table";

import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { m } from "motion/react";

function View() {
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const data = {
        menuName: "hyper",
        menuIcon: "/images/module-icon.png", // 👈 place image in /public/images/
        parentMenu: "venu",
        status: "Required",
        userType: "Admin",
        action: "Edit Form, Show page",
        permissions: "Module Access, Module Create",
        defaultValue: "Checked",
        databaseValue: "Module Access, Module Create",
        maxFileSize: "2MB",
        multipleFile: "Yes",
        model: "Yes",
        ckeditor: "User",
    };

    // Convert key to readable label
    const formatLabel = (key: string) => {
        return key
            .replace(/([A-Z])/g, " $1") // camelCase → space

            .replace(/^./, (str) => str.toUpperCase()); // capitalize
    };

    const radioColumns = [
        {
            accessorKey: "value",
            enableSorting: false,
            header: ({ column }) => (
                <DataGridColumnHeader column={column} title="Database Value" />
            ),
        },
        {
            accessorKey: "label",
            enableSorting: false,
            header: ({ column }) => (
                <DataGridColumnHeader column={column} title="Label Text" />
            ),
        },
    ];

    const radioData = [
        { name: "male", name2: "male" },
        { name: "female", name2: "female" },
    ];

    const selectData = [
        { name: "1", name2: "Option 1" },
        { name: "2", name2: "Option 2" },
    ];

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "name",
                id: "Database Value",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Database Value" column={column} />
                ),
                cell: ({ row }) => row.original.name || "-",
                size: 300,
            },
            {
                accessorKey: "name2",
                id: "Labeled Text",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Label Text" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {row.original.name2}
                    </span>
                ),
                size: 300,
            },
        ],
        [selectedRow],
    );
    const Filedscolums = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "type",
                id: "Type",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Type" column={column} />
                ),
                cell: ({ row }) => row.original.type || "-",
                size: 200,
            },
            {
                accessorKey: "database_column",
                id: "databaseColumn",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Database Column" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="inline-flex items-centerpx-2 py-0.5 text-xs">
                        {row.original.database_column}
                    </span>
                ),
                size: 200,
            },
            {
                accessorKey: "label",
                id: "Label",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Label" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="inline-flex items-center  py-0.5 text-xs ">
                        {row.original.label}
                    </span>
                ),
                size: 75,
            },
            {
                accessorKey: "validation",
                id: "Validation",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Validation" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="inline-flex items-center  px-2 py-0.5 text-xs  ">
                        {row.original.validation}
                    </span>
                ),
                size: 75,
            },
            {
                accessorKey: "tooltip_text",
                id: "Tooltip text",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Tooltip text" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="inline-flex items-center  px-2 py-0.5 text-xs  ">
                        {row.original.tooltip_text}
                    </span>
                ),
                size: 75,
            },
            {
                accessorKey: "visibility",
                id: "Visibility",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Visibility" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="inline-flex items-center  px-2 py-0.5 text-xs ">
                        {row.original.visibility}
                    </span>
                ),
                size: 75,
            },
        ],
        [selectedRow],
    );


    const Filedsdata = [
        {
            type: "Auto_Increment",
            database_column: "id",
            label: "ID",
            validation: "Required",
            tooltip_text: "!",
            visibility: "Create Form",
        },
        {
            type: "Auto_Increment",
            database_column: "created_at",
            label: "Created At",
            validation: "Unique",
            tooltip_text: "!",
            visibility: "Create Form",
        },
    ];

    const fieldstable = useReactTable({
        columns: Filedscolums,
        data: Filedsdata,
        getCoreRowModel: getCoreRowModel(),
    });

    const table = useReactTable({
        columns,
        data: radioData,
        getCoreRowModel: getCoreRowModel(),
    });

    const selecttable = useReactTable({
        columns,
        data: selectData,
        getCoreRowModel: getCoreRowModel(),
    });
    const extraOptionscolumns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "value",
                id: "Database Value",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Database Value" column={column} />
                ),
                cell: ({ row }) => row.original.value || "-",
                size: 300,
            },
            {
                accessorKey: "label",
                id: "Labeled Text",
                enableSorting: true,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Label Text" column={column} />
                ),
                cell: ({ row }) =>

                    row.original.label || "-",


                size: 300,
            },
        ],
        [selectedRow],
    );

    const extraOptionsdata = [
        {
            value: "male",
            label: "Male"
        },
        {
            value: "female",
            label: "Female"
        },
    ];
    const extraOptionstable = useReactTable({
        columns: extraOptionscolumns,
        data: extraOptionsdata,
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
            <div className="grid grid-cols-2 gap-4 mt-4">
                <DataGrid table={table} recordCount={0}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Radio</CardTitle>
                        </CardHeader>

                        <CardTable>
                            <DataGridTable />
                        </CardTable>


                    </Card>
                </DataGrid>

                <DataGrid table={selecttable} recordCount={0}>
                    <Card>
                        <CardHeader>
                            <CardTitle>select</CardTitle>
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
            <div className="grid grid-cols-2 gap-4 mt-4">

                <DataGrid table={extraOptionstable} recordCount={0}>
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

