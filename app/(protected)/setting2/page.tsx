import { Metadata } from 'next';
import AccountDetails from './my-profile/page';

export const metadata: Metadata = {
    title: 'setting',
    description: 'Manage setting.',
};

export default async function Page() {
    return (
        <>
            <AccountDetails />
        </>
    );
}
