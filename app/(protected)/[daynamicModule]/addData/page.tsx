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
export default async function Page() {
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
                                    <BreadcrumbPage>Master Module</BreadcrumbPage>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Parent Module</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </ToolbarHeading>
                    <ToolbarActions>
                        <Button asChild variant="outline">
                            <Link href="/masterModule">
                                <MoveLeft />
                                Back to masterModule
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>
            <Container>
                <FormModule></FormModule>
            </Container>
        </>
    );
}
