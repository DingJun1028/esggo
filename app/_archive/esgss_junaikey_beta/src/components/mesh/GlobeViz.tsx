import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { useTheme } from '@mui/material/styles';

interface NodeData {
    id: string;
    lat: number;
    lng: number;
    name: string;
    health: number; // 0-1
    type: 'hub' | 'sensor' | 'agent';
}

interface ArcData {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    color: string;
}

const SAMPLE_NODES: NodeData[] = [
    { id: 'london', lat: 51.5074, lng: -0.1278, name: 'London Hub', health: 0.95, type: 'hub' },
    { id: 'tokyo', lat: 35.6762, lng: 139.6503, name: 'Tokyo Node', health: 0.88, type: 'sensor' },
    { id: 'ny', lat: 40.7128, lng: -74.0060, name: 'NY Nexus', health: 0.92, type: 'hub' },
    { id: 'singapore', lat: 1.3521, lng: 103.8198, name: 'SG Gateway', health: 0.98, type: 'agent' },
    { id: 'sydney', lat: -33.8688, lng: 151.2093, name: 'Sydney Outpost', health: 0.85, type: 'sensor' },
];

const SAMPLE_ARCS: ArcData[] = [
    { startLat: 51.5074, startLng: -0.1278, endLat: 40.7128, endLng: -74.0060, color: '#00FFFF' }, // London -> NY
    { startLat: 35.6762, startLng: 139.6503, endLat: 1.3521, endLng: 103.8198, color: '#FFD700' }, // Tokyo -> SG
    { startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, color: '#00FFFF' }, // Sydney -> SG
];

export const GlobeViz: React.FC = () => {
    const globeEl = useRef<any>(null);
    const [points, setPoints] = useState<NodeData[]>(SAMPLE_NODES);
    const [arcs, setArcs] = useState<ArcData[]>(SAMPLE_ARCS);

    useEffect(() => {
        // Auto-rotate
        const globe = globeEl.current;
        if (globe) {
            globe.controls().autoRotate = true;
            globe.controls().autoRotateSpeed = 0.5;
        }
    }, []);

    return (
        <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

            // Points (ESG Nodes)
            pointsData={points}
            pointLat="lat"
            pointLng="lng"
            pointColor={(d: any) => d.health > 0.9 ? '#4ade80' : '#facc15'}
            pointAltitude={0.05}
            pointRadius={0.5}
            pointLabel="name"

            // Arcs (Data Flow)
            arcsData={arcs}
            arcColor="color"
            arcDashLength={0.5}
            arcDashGap={1}
            arcDashAnimateTime={2000}
            arcStroke={0.5}

            // Atmosphere
            atmosphereColor="#00FFFF"
            atmosphereAltitude={0.15}
        />
    );
};

