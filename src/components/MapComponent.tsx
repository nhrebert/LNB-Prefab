"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { projectsData } from "@/app/projects/page";
const createCustomIcon = (colorClass: string) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="w-6 h-6 rounded-full border-2 border-white shadow-md ring-1 ring-slate-200/50 flex items-center justify-center ${colorClass}"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const activeIcon = createCustomIcon('bg-blue-500');
const delayedIcon = createCustomIcon('bg-orange-500');
const hubIcon = createCustomIcon('bg-slate-800 rounded-md w-8 h-8'); // Different shape for hubs

// Major Pre-Fab Hub Coordinates
const HUB_DENVER: [number, number] = [39.7392, -104.9903];
const HUB_AUSTIN: [number, number] = [30.2672, -97.7431];
const HUB_FRANKLIN: [number, number] = [35.9251, -86.8689];

const hubs = [
    { id: 'hub-denver', name: 'Denver Pre-Fab Hub', coords: HUB_DENVER },
    { id: 'hub-austin', name: 'Austin Pre-Fab Hub', coords: HUB_AUSTIN },
    { id: 'hub-franklin', name: 'Franklin Pre-Fab Hub', coords: HUB_FRANKLIN },
];

const austinGeofence: [number, number][] = [
    [30.2700, -97.7450],
    [30.2720, -97.7400],
    [30.2650, -97.7380],
    [30.2640, -97.7430],
];

// Polygon points for Denver Hospital Site Geofence
const denverGeofence: [number, number][] = [
    [39.7410, -104.9920],
    [39.7410, -104.9880],
    [39.7370, -104.9880],
    [39.7370, -104.9920],
];

const US_BOUNDS: [[number, number], [number, number]] = [
    [24.396308, -125.0], // Southwest
    [49.384358, -66.93457], // Northeast
];

interface MapComponentProps {
    onProjectClick?: (projectId: string) => void;
    showProjectSites?: boolean;
    showHubs?: boolean;
    showInTransit?: boolean;
}

export default function MapComponent({
    onProjectClick,
    showProjectSites = true,
    showHubs = true,
    showInTransit = true,
}: MapComponentProps) {
    const [activeSiteId, setActiveSiteId] = React.useState<string | null>(null);

    return (
        <MapContainer
            center={HUB_DENVER}
            zoom={5}
            minZoom={4}
            maxBounds={US_BOUNDS}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            className="w-full h-full rounded-sm shadow-inner z-0"
            style={{ background: 'transparent' }}
        >
            {/* OpenStreetMap standard street tiles cropped to US */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                bounds={US_BOUNDS}
                noWrap={true}
            />
            {/* Major Pre-Fab Hubs */}
            {showHubs && hubs.map((hub) => (
                <Marker
                    key={hub.id}
                    position={hub.coords}
                    icon={hubIcon}
                >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                        <span className="font-bold text-slate-800">{hub.name}</span>
                    </Tooltip>
                    <Popup className="font-sans min-w-[150px]">
                        <strong className="block text-slate-900 border-b border-slate-200 pb-1 mb-1">{hub.name}</strong>
                        <span className="text-xs text-slate-500 font-medium block">Pre-Fab Location</span>
                    </Popup>
                </Marker>
            ))}

            {/* Dynamically Generate Project Markers */}
            {showProjectSites && projectsData.map((project) => (
                <React.Fragment key={project.id}>
                    <Marker
                        position={project.coordinates as [number, number]}
                        icon={activeIcon}
                        eventHandlers={{
                            click: () => setActiveSiteId(project.id)
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <span className="font-bold text-slate-800 shadow-sm">{project.name}</span>
                        </Tooltip>
                        <Popup
                            className="font-sans min-w-[200px]"
                            eventHandlers={{ remove: () => setActiveSiteId(null) }}
                        >
                            <strong className="block text-slate-900 border-b border-slate-200 pb-1 mb-1">{project.name}</strong>
                            <span className="text-xs text-blue-600 font-bold block">{project.assignedToolCount} Tools Assigned</span>
                            {onProjectClick && (
                                <button
                                    onClick={() => onProjectClick(project.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded w-full mt-2 transition-colors"
                                >
                                    View Allocated Tools
                                </button>
                            )}
                        </Popup>
                    </Marker>
                    {activeSiteId === project.id && (
                        <Circle
                            center={project.coordinates as [number, number]}
                            pathOptions={{
                                color: '#2563eb',
                                weight: 3,
                                opacity: 0.9,
                                dashArray: '8, 8',
                                fillColor: '#3b82f6',
                                fillOpacity: 0.1
                            }}
                            radius={1609.34} // 1 mile in meters, adjusted for better visual scale
                        />
                    )}
                </React.Fragment>
            ))}
        </MapContainer>
    );
}
