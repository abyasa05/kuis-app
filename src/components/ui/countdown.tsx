"use client"

import { useEffect, useState } from "react";
import { useQuizStore } from "@/components/stores";

interface CountdownProps{
    onTimeout?: () => void;
}

export default function Countdown({ onTimeout }: CountdownProps) {
    const endTime = useQuizStore((state) => state.endTime);
    const hasHydrated = useQuizStore((state) => state.hasHydrated);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    // useEffect(() => {
    //     if (!hasHydrated) {
    //         return;
    //     }

    //     if (endTime === 0) {
    //         setEndTime(Date.now() + 6 * 60 * 1000)
    //     }
    // }, [hasHydrated, endTime, setEndTime]);

    useEffect(() => {
        if (!hasHydrated || endTime === 0){
            return;
        }

        const intervalId = setInterval(() => {
            const diff = Math.max(
                0,
                Math.ceil((endTime - Date.now()) / 1000)
            )

            setRemainingSeconds(diff);

            if (diff <= 0) {
                clearInterval(intervalId);
                onTimeout?.();
            }
        }, 1000)

        return () => clearInterval(intervalId);
    }, [hasHydrated, endTime, onTimeout]);

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return (
        <div>
            Time remaining <b>{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</b>
        </div>
    )
}