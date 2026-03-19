"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

export function ClientStoreInit() {
    const initialized = useRef(false);
    const initFromServer = useAppStore(state => state.initFromServer);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            initFromServer().catch(console.error);
        }
    }, [initFromServer]);

    return null;
}
