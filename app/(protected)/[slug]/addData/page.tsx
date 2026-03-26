import { Metadata } from 'next';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Container } from '@/components/common/container';
import {
    Toolbar,
    ToolbarActions,
    ToolbarHeading,
    ToolbarTitle,
} from '@/components/common/toolbar';
export const metadata: Metadata = {
    title: 'Roles',
    description: 'Manage Roles.',
};
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';

import FormModule from "./component/FormModule";
export default async function Page({ params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params; // ✅ IMPORTANT
    console.log("this is slug", slug)
    return (
        <>
            <Container>
                <Toolbar>
                    <ToolbarHeading>
                        <ToolbarTitle>Master Module</ToolbarTitle>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${slug}`}>Master Module</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Add Data</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </ToolbarHeading>
                    {/* <ToolbarActions>
                        <Button asChild variant="outline">
                            <Link href={`/${slug}`}>
                                <MoveLeft />
                                Back to masterModule
                            </Link>
                        </Button>
                    </ToolbarActions> */}
                </Toolbar>
            </Container>
            <Container>
                <FormModule slug={slug}></FormModule>
            </Container>
        </>
    );
}
