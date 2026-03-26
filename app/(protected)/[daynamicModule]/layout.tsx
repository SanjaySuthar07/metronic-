import { notFound } from "next/navigation";

// async function getModule(slug: string) {
//     try {
//         const res = await fetch(`API_URL/${slug}`, {
//             cache: "no-store",
//         });

//         if (!res.ok) return null;

//         const data = await res.json();

//         return data?.data || null;
//     } catch (error) {
//         return null;
//     }
// }

export default async function DynamicLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { dynamicModule: string };
}) {
    // const moduleData = await getModule(params.dynamicModule);

    // // ❌ INVALID → 404
    // if (!moduleData) {
    //     return notFound();
    // }

    // ✅ VALID → render children
    return (
        <div>
            {/* optional: header */}
            <h1 className="text-lg font-semibold mb-4">
                {/* {moduleData.menu_title} */}
            </h1>

            {children}
        </div>
    );
}