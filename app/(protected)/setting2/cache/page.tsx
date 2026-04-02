"use client";

import { Card, CardContent, CardDescription, CardHeader, CardHeading, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Settings,
  Route,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Trash2, RefreshCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCacheSettings } from "@/store/thunk/settings.thunk";
import { toast } from "sonner";

const cacheList = [
  {
    title: "Clear All Cache",
    description:
      "Clear caching: database caching, static blocks... Run this command when you don't see the changes after updating data.",
    icon: Database,
    color: "bg-blue",
    action: "clear-cache",
    buttonText: "Clear",
    showSize: true,
    buttonIcon: Trash2,
  },
  {
    title: "Refresh compiled views",
    description: "Clear compiled views to make views up to date.",
    icon: RefreshCcw,
    color: "bg-yellow",
    action: "clear-view-cache",
    buttonText: "Refresh",
    buttonIcon: RefreshCcw,

  },
  {
    title: "Clear config cache",
    description:
      "You might need to refresh the config caching when you change something on production environment.",
    icon: Settings,
    color: "bg-blue",
    action: "clear-config-cache",
    buttonText: "Clear",
    buttonIcon: RefreshCcw,

  },
  {
    title: "Clear route cache",
    description: "Clear cache routing.",
    icon: Route,
    color: "bg-green",
    action: "clear-route-cache",
    buttonText: "Clear",
    buttonIcon: RefreshCcw,
  },
  {
    title: "Clear log",
    description: "Clear system log files.",
    icon: FileText,
    color: "bg-red",
    action: "clear-logs",
    buttonText: "Clear",
    buttonIcon: Trash2,
  },
];

export default function Cache() {
  const { user } = useSelector((s: any) => s.auth)
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [cacheSize, setCacheSize] = useState<string>(user?.cache_size?.total || "0.00 B");

  const handleAction = async (type: string) => {
    try {
      setLoadingAction(type);
      const res = await dispatch(fetchCacheSettings({ type }));
      if (fetchCacheSettings.fulfilled.match(res)) {
        const total = res.payload?.data?.after?.total;
        toast.success(res.payload?.message);
        if (total) {
          setCacheSize(total);
        }
      }
      setLoadingAction(null);
    } catch {
      setLoadingAction(null);
    }
  };

  return (
    <Card>
      <CardHeader className="py-4">
        <CardHeading>
          <CardTitle>Cache Settings</CardTitle>
          <CardDescription>
            Manage Cache configurations
          </CardDescription>
        </CardHeading>
      </CardHeader>

      <CardContent className="space-y-4">

        {cacheList.map((item) => (
          <div
            key={item.action}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            {/* LEFT */}
            <div className="flex items-start gap-4">

              {/* ICON */}
              <div
                className={`p-3 rounded-lg text-white ${item.color}-500 `}
              >
                <item.icon size={20} />
              </div>

              {/* TEXT */}
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                {item.showSize && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Current Size: {cacheSize}
                  </div>
                )}
              </div>

            </div>

            <Button
              onClick={() => handleAction(item.action)}
              disabled={loadingAction === item.action}
              className={`flex items-center gap-2 ${item.color}-500`}
            >
              {item.buttonIcon && <item.buttonIcon size={16} />}

              {loadingAction === item.action
                ? "Processing..."
                : item.buttonText}
            </Button>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}