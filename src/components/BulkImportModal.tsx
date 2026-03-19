"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppStore, ToolItem } from "@/lib/store";
import Papa from "papaparse";

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BulkImportModal({ isOpen, onClose }: BulkImportModalProps) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [parsedCount, setParsedCount] = useState(0);

    const bulkImportTools = useAppStore(state => state.bulkImportTools);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleProcess = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const text = await file.text();
            const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
            const json = parsed.data as any[];

            const getImageForAsset = (cat: string, name: string) => {
                const text = (String(cat) + " " + String(name)).toLowerCase();

                if (text.includes("drill") || text.includes("impact") || text.includes("auger")) return "https://plus.unsplash.com/premium_photo-1753026614895-f0b5b8eaef2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGV3YWx0JTIwZHJpbGx8ZW58MHx8fHwxNzcyODMxMTczfDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("saw") || text.includes("blade")) return "https://plus.unsplash.com/premium_photo-1663133625047-4dd73fb92976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2lyY3VsYXIlMjBzYXd8ZW58MHx8fHwxNzcyODMwNjM1fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("generator") || text.includes("power supply") || text.includes("motor")) return "https://plus.unsplash.com/premium_photo-1671439135739-96bbe677c38c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cG9ydGFibGUlMjBnZW5lcmF0b3J8ZW58MHx8fHwxNzcyODMxMTc0fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("compressor") || text.includes("pneumatic") || text.includes("air tool")) return "https://plus.unsplash.com/premium_photo-1682210260765-8fd414be79cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YWlyJTIwY29tcHJlc3NvciUyMGNvbnN0cnVjdGlvbnxlbnwwfHx8fDE3NzI4MzExNzR8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("ladder") || text.includes("step")) return "https://plus.unsplash.com/premium_photo-1663088627718-bec1336c6392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwbGFkZGVyfGVufDB8fHx8MTc3MjgzMTE3NXww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("weld") || text.includes("torch") || text.includes("plasma")) return "https://plus.unsplash.com/premium_photo-1677172409593-0d0674ac69b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2VsZGluZyUyMHNwYXJrc3xlbnwwfHx8fDE3NzI4MzExNzV8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("hvac") || text.includes("fan")) return "https://plus.unsplash.com/premium_photo-1666788168118-1ff2689c5910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aW5kdXN0cmlhbCUyMGZhbiUyMHdhcmVob3VzZXxlbnwwfHx8fDE3NzI4MzI2OTV8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("heater")) return "https://plus.unsplash.com/premium_photo-1663040285798-0d57172d3b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aW5kdXN0cmlhbCUyMGhlYXRlciUyMGNvbnN0cnVjdGlvbnxlbnwwfHx8fDE3NzI4MzI2OTl8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("crimp") || text.includes("cut") || text.includes("strip") || text.includes("plier") || text.includes("die")) return "https://plus.unsplash.com/premium_photo-1723874412055-69870e5746c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGxpZXJzfGVufDB8fHx8MTc3MjgzMTE3Nnww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("multimeter") || text.includes("test") || text.includes("measure") || text.includes("fluke")) return "https://plus.unsplash.com/premium_photo-1723921228640-7e9bb9cb2cfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGlnaXRhbCUyMG11bHRpbWV0ZXJ8ZW58MHx8fHwxNzcyODMxMTc3fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("lift") || text.includes("heavy") || text.includes("forklift") || text.includes("boom") || text.includes("hoist")) return "https://plus.unsplash.com/premium_photo-1661957532934-400acebc71b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwYm9vbSUyMGxpZnR8ZW58MHx8fHwxNzcyODMxMTc4fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("safe") || text.includes("ppe") || text.includes("fall")) return "https://plus.unsplash.com/premium_photo-1664301191471-0dc137e504bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwc2FmZXR5JTIwaGFybmVzc3xlbnwwfHx8fDE3NzI4MzExNzl8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("harness") || text.includes("lanyard") || text.includes("retractable")) return "https://plus.unsplash.com/premium_photo-1677529102407-0d075eb2cbb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZmFsbCUyMHByb3RlY3Rpb24lMjBzYWZldHklMjBoYXJuZXNzJTIwcmV0cmFjdGFibGV8ZW58MHx8fHwxNzcyODMyODkxfDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("hammer drill") || text.includes("demo hammer")) return "https://plus.unsplash.com/premium_photo-1678454429914-515418744e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZGVtb2xpdGlvbiUyMGhhbW1lciUyMGRyaWxsfGVufDB8fHx8MTc3MjgzMjg4NHww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("hammer") || text.includes("mallet") || text.includes("demo")) return "https://plus.unsplash.com/premium_photo-1723651228034-58b60c613964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2xlZGdlJTIwaGFtbWVyfGVufDB8fHx8MTc3MjgzMTE3OXww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("wrench") || text.includes("ratchet") || text.includes("torque")) return "https://plus.unsplash.com/premium_photo-1663090072552-46099749ab96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c29ja2V0JTIwd3JlbmNofGVufDB8fHx8MTc3MjgzMTE4MHww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("screw") || text.includes("driver")) return "https://plus.unsplash.com/premium_photo-1723867304554-a725c4a91b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2NyZXdkcml2ZXJ8ZW58MHx8fHwxNzcyODMxMTgwfDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("paint") || text.includes("spray")) return "https://plus.unsplash.com/premium_photo-1663047450953-2251c9d5f2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGFpbnQlMjBzcHJheSUyMGd1biUyMHRvb2x8ZW58MHx8fHwxNzcyODMxMTgxfDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("fleet") || text.includes("truck") || text.includes("vehicle") || text.includes("trailer") || text.includes("auto")) return "https://plus.unsplash.com/premium_photo-1730500169149-f505e3d0b792?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwcGlja3VwJTIwdHJ1Y2t8ZW58MHx8fHwxNzcyODMxMTgyfDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("pump") || text.includes("water removal")) return "https://plus.unsplash.com/premium_photo-1682146784688-3d65bfb7602f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aW5kdXN0cmlhbCUyMHdhdGVyJTIwcHVtcHxlbnwwfHx8fDE3NzI4MzI4OTR8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("light") || text.includes("lamp") || text.includes("led")) return "https://plus.unsplash.com/premium_photo-1678766819199-5660bab7085b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwd29yayUyMGxpZ2h0JTIwZ2VuZXJhdG9yfGVufDB8fHx8MTc3MjgzMTE4M3ww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("storage") || text.includes("box") || text.includes("gangbox") || text.includes("cabinet") || text.includes("shelv")) return "https://plus.unsplash.com/premium_photo-1750594942636-1aad593584d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dG9vbCUyMGJveCUyMHN0b3JhZ2V8ZW58MHx8fHwxNzcyODMwNjU1fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("survey") || text.includes("laser level") || text.includes("transit") || text.includes("opti")) return "https://plus.unsplash.com/premium_photo-1721778862294-532494a0e530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bGFzZXIlMjBkaXN0YW5jZSUyMG1lYXN1cmUlMjBsZXZlbHxlbnwwfHx8fDE3NzI4MzI4OTJ8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("broom") || text.includes("clean") || text.includes("sweep") || text.includes("janit")) return "https://plus.unsplash.com/premium_photo-1712416360822-286addd963e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cHVzaCUyMGJyb29tfGVufDB8fHx8MTc3MjgzMTE4NHww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("grinder") || text.includes("abrasive")) return "https://plus.unsplash.com/premium_photo-1682147470728-07d41b46b5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YW5nbGUlMjBncmluZGVyJTIwdG9vbCUyMHNwYXJrc3xlbnwwfHx8fDE3NzI4MzExODV8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("wire pull") || text.includes("spool") || text.includes("turtle")) return "https://plus.unsplash.com/premium_photo-1759521015009-cdd8f7129911?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZWxlY3RyaWNpdHklMjB3aXJlJTIwc3Bvb2x8ZW58MHx8fHwxNzcyODMyNjMwfDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("cord") || text.includes("temp power")) return "https://plus.unsplash.com/premium_photo-1664695710295-b524b34386db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dGVtcG9yYXJ5JTIwcG93ZXIlMjBzdXBwbHklMjBjb25zdHJ1Y3Rpb258ZW58MHx8fHwxNzcyODMyODg4fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("jack") || text.includes("roller")) return "https://plus.unsplash.com/premium_photo-1663050703238-46020b4ffb39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aGVhdnklMjBwYWxsZXQlMjBqYWNrJTIwY29uc3RydWN0aW9ufGVufDB8fHx8MTc3MjgzMjY5MXww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("stand")) return "https://plus.unsplash.com/premium_photo-1664392180099-d828b900de7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGlwZSUyMHN0YW5kJTIwdG9vbHxlbnwwfHx8fDE3NzI4MzI2OTJ8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("knock")) return "https://plus.unsplash.com/premium_photo-1675109458943-8d2bb28f3ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aHlkcmF1bGljJTIwa25vY2tvdXQlMjBwdW5jaHxlbnwwfHx8fDE3NzI4MzI2OTN8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("radio")) return "https://plus.unsplash.com/premium_photo-1661288426286-55e49acbef3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2Fsa2llJTIwdGFsa2llJTIwY29uc3RydWN0aW9ufGVufDB8fHx8MTc3MjgzMjY5NHww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("vacuum") || text.includes("vac")) return "https://plus.unsplash.com/premium_photo-1663045715585-6c6e8b56d1cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aW5kdXN0cmlhbCUyMHNob3AlMjB2YWN1dW18ZW58MHx8fHwxNzcyODMyNjk2fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("thread")) return "https://plus.unsplash.com/premium_photo-1664392180099-d828b900de7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGlwZSUyMHRocmVhZGluZyUyMG1hY2hpbmV8ZW58MHx8fHwxNzcyODMyNjk3fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("grease")) return "https://plus.unsplash.com/premium_photo-1677706696918-7bb552ed0a6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aW5kdXN0cmlhbCUyMGdyZWFzZSUyMGd1biUyMHRvb2x8ZW58MHx8fHwxNzcyODMyNjk4fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("connex")) return "https://plus.unsplash.com/premium_photo-1764691289861-59329615aa96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2hpcHBpbmclMjBjb250YWluZXIlMjBjb25zdHJ1Y3Rpb258ZW58MHx8fHwxNzcyODMyNzAwfDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("printer")) return "https://plus.unsplash.com/premium_photo-1661878934477-707e95033e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bGFyZ2UlMjBvZmZpY2UlMjBwcmludGVyfGVufDB8fHx8MTc3MjgzMjcwMXww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("pvc") || text.includes("conduit")) return "https://plus.unsplash.com/premium_photo-1759834499575-063617ef8f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZWxlY3RyaWNhbCUyMGNvbmR1aXQlMjBwdmMlMjBwaXBlfGVufDB8fHx8MTc3MjgzMjg4NXww&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("bandsaw")) return "https://plus.unsplash.com/premium_photo-1674508713892-50cb9bb73520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmFuZHNhdyUyMHRvb2x8ZW58MHx8fHwxNzcyODMyODg2fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("arc flash") || text.includes("flash suit")) return "https://plus.unsplash.com/premium_photo-1677172409593-0d0674ac69b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8d2VsZGluZyUyMHNwYXJrc3xlbnwwfHx8fDE3NzI4MzExNzV8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("socket")) return "https://plus.unsplash.com/premium_photo-1677009834523-367c2e9b281c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bWVjaGFuaWMlMjBzb2NrZXQlMjBzZXR8ZW58MHx8fHwxNzcyODMyODk1fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("sawzall")) return "https://plus.unsplash.com/premium_photo-1763492118012-a3f9a9593510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cmVjaXByb2NhdGluZyUyMHNhdyUyMHRvb2x8ZW58MHx8fHwxNzcyODMyODk2fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("inspection") || text.includes("borescope")) return "https://plus.unsplash.com/premium_photo-1730049385918-01bd174baed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Ym9yZXNjb3BlJTIwaW5zcGVjdGlvbiUyMGNhbWVyYXxlbnwwfHx8fDE3NzI4MzI4OTh8MA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("trash")) return "https://plus.unsplash.com/premium_photo-1661290296426-d55fd01740c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwdHJhc2glMjBiaW58ZW58MHx8fHwxNzcyODMyODk4fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("bend") || text.includes("shoe") || text.includes("knockout")) return "https://plus.unsplash.com/premium_photo-1674078860805-86c534b2b2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGxpZXJzJTIwaGFuZCUyMHRvb2x8ZW58MHx8fHwxNzcyODMxMTc3fDA&ixlib=rb-4.1.0&q=80&w=400";
                if (text.includes("scaffold") || text.includes("baker")) return "https://plus.unsplash.com/premium_photo-1663088627718-bec1336c6392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29uc3RydWN0aW9uJTIwbGFkZGVyfGVufDB8fHx8MTc3MjgzMTE3NXww&ixlib=rb-4.1.0&q=80&w=400";

                return "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?w=500&q=80";
            };

            const newTools: ToolItem[] = json.map((row: any, i) => {
                // Fuzzy matching logic based on the Reftab screenshot
                const categoryRaw = row["Category"] || row["Type"] || "Uncategorized";
                const loanStatus = row["Loan Status"] || row["Status"];
                const mappedStatus = (loanStatus && loanStatus.toString().toLowerCase().includes("out")) ? "Checked Out" : "Available";

                let condition = "Good";
                if (row["Status Label"]) {
                    const sl = row["Status Label"].toString().toLowerCase();
                    if (sl.includes("missing") || sl.includes("lost")) condition = "Lost";
                    if (sl.includes("retired") || sl.includes("destroyed")) condition = "Destroyed";
                    if (sl.includes("repair")) condition = "Needs Repair";
                }

                // If "Asset Name" isn't present, construct one from Category and ID
                const serial = row["Serial Number"] || row["ID"] || `IMP-${Date.now()}-${i}`;
                const name = row["Asset Name"] || row["Item"] || row["Tool"] || row["Name"] || `${categoryRaw} (${serial})`;

                return {
                    id: serial,
                    name: name,
                    category: categoryRaw,
                    image: row["Image"] || getImageForAsset(categoryRaw, name),
                    status: mappedStatus,
                    location: row["Location"] || row["Yard"] || "Warehouse A",
                    condition: condition,
                };
            });

            if (newTools.length > 0) {
                bulkImportTools(newTools);
                setParsedCount(newTools.length);
                setSuccess(true);
            }

        } catch (error) {
            console.error(error);
            alert("Error parsing file. Please check format!");
        }

        setIsProcessing(false);

        if (success || true) {
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFile(null);
                setParsedCount(0);
            }, 2500);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-sm">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold text-slate-900">Import Asset Roster</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Upload your existing tool data via CSV or Excel to rapidly populate the directory.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6">
                    {success ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 font-teko uppercase tracking-wide">Import Successful!</h3>
                            <p className="text-slate-500 mt-1 font-medium">Successfully parsed {parsedCount} new assets.</p>
                        </div>
                    ) : (
                        <>
                            {/* Drag and Drop Zone */}
                            <div
                                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors relative cursor-pointer
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}
                  ${file ? 'border-emerald-500 bg-emerald-50/50' : ''}
                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('csv-upload')?.click()}
                            >
                                <input
                                    type="file"
                                    id="csv-upload"
                                    className="hidden"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                                />

                                {file ? (
                                    <>
                                        <FileSpreadsheet className="w-12 h-12 text-emerald-500 mb-3" />
                                        <p className="text-sm font-bold text-slate-900">{file.name}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                            <UploadCloud className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">Click to upload or drag & drop</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">CSV or Excel (max. 10MB)</p>
                                    </>
                                )}
                            </div>

                            {/* Requirements Note */}
                            <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div className="text-xs font-medium text-slate-600 leading-relaxed">
                                    Required columns: <span className="font-bold text-slate-900">Asset Name</span>, <span className="font-bold text-slate-900">Category</span>, and <span className="font-bold text-slate-900">Location</span>.
                                    Optional columns: Brand, Model, Serial #, Condition, Date Purchased, Cost.
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {!success && (
                    <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 sm:justify-between">
                        <Button variant="ghost" onClick={onClose} className="text-slate-600 font-semibold hover:bg-slate-200 transition-colors">
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold px-6"
                            disabled={!file || isProcessing}
                            onClick={handleProcess}
                        >
                            {isProcessing ? "Processing..." : "Import Assets"}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
