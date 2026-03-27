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
    ToolbarHeading,
    ToolbarTitle,
} from '@/components/common/toolbar';

export const metadata: Metadata = {
    title: 'Roles',
    description: 'Manage Roles.',
};

import FormModule from "../component/FormModule";


export default async function EditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params; // ✅ IMPORTANT

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
                                    <BreadcrumbPage>Edit Module</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </ToolbarHeading>
                </Toolbar>
            </Container>

            <Container>
                <FormModule mode="edit" id={id} />
            </Container>
        </>
    );
}