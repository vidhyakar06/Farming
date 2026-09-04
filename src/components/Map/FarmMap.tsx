import { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DrawingManager } from '@react-google-maps/api';

type Library = "geometry" | "drawing" | "places";
const libraries: Library[] = ['drawing', 'geometry'];

interface FarmMapProps {
  onAreaCalculated: (areaInAcres: number, lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function FarmMap({ onAreaCalculated, initialLat, initialLng }: FarmMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any,
  });

  const polygonRef = useRef<google.maps.Polygon | null>(null);

  const center = initialLat && initialLng ? { lat: initialLat, lng: initialLng } : defaultCenter;

  const onLoad = useCallback(function callback(_map: google.maps.Map) {
    // optional map setup
  }, []);

  const onUnmount = useCallback(function callback() {
    // optional cleanup
  }, []);

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    // Remove previous polygon if exists
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }
    polygonRef.current = polygon;

    const path = polygon.getPath();
    
    // Calculate area in square meters
    const areaSqMeters = google.maps.geometry.spherical.computeArea(path);
    
    // Convert to acres (1 sq meter = 0.000247105 acres)
    const areaAcres = areaSqMeters * 0.000247105;

    // Get the first point as the location reference
    const firstPoint = path.getAt(0);

    onAreaCalculated(Number(areaAcres.toFixed(2)), firstPoint.lat(), firstPoint.lng());
  };

  if (!isLoaded) return <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-xl">Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '0.75rem' }}
      center={center}
      zoom={initialLat ? 16 : 5}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapTypeId="satellite"
    >
      <DrawingManager
        onPolygonComplete={onPolygonComplete}
        options={{
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
          },
          polygonOptions: {
            fillColor: '#22c55e',
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: '#16a34a',
            editable: true,
            zIndex: 1,
          },
        }}
      />
    </GoogleMap>
  );
}
