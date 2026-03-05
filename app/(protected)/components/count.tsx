"use client";
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
interface CountBox {
    item?: any;
}
function CountBox({ item }: CountBox) {
    return (
        <Card className="rounded-xl overflow-hidden">
            <CardContent className="p-0 flex flex-col justify-between h-[140px] bg-cover bg-no-repeat channel-stats-bg">
                <div className="pt-4 ps-5">
                    {item.logoDark ? (
                        <>
                            <Image
                                src={toAbsoluteUrl(`/media/ui/${item.logo}`)}
                                alt="logo"
                                width={28}
                                height={28}
                                className="dark:hidden"
                                style={{ width: "auto", height: "auto" }}
                            />
                            <Image
                                src={toAbsoluteUrl(`/media/ui/${item.logoDark}`)}
                                alt="logo"
                                width={28}
                                height={28}
                                style={{ width: "auto", height: "auto" }}
                                className="light:hidden"
                            />
                        </>
                    ) : (
                        <Image
                            src={toAbsoluteUrl(`/media/ui/${item.logo}`)}
                            alt="logo"
                            width={28}
                            height={28}
                            style={{ width: "auto", height: "auto" }}
                        />
                    )}
                </div>
                <div className="pb-4 px-5 flex flex-col gap-1">
                    <span className="text-3xl font-semibold text-mono">
                        {item.info ?? 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {item.desc}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default CountBox
