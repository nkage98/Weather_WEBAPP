import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { AttributionControl } from "react-leaflet";

export function WeatherMap({
    lat,
    lon,
    city,
}: {
    lat: number;
    lon: number;
    city: string;
}) {
    return (
        <MapContainer
            center={[lat, lon]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap </a> contributors'
            />
            <Marker position={[lat, lon]}>
                <Popup>{city}</Popup>
            </Marker>
            <AttributionControl position="bottomleft" />
        </MapContainer>
    );
}
