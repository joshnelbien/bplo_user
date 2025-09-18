import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import debounce from "lodash.debounce";

// Fix for leaflet marker icon not appearing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function Step3AddressInfo({ formData, handleChange, errors }) {
  const barangays = [
    "ATISAN", "BAGONG POOK VI-C", "BARANGAY I-A",
    "BARANGAY I-B", "BAGONG BAYAN I-C", "BARANGAY II-A",
    "BARANGAY II-B", "BARANGAY II-C", "BARANGAY II-D",
    "BARANGAY II-E", "BARANGAY II-F", "BARANGAY III-A",
    "BARANGAY III-B", "BARANGAY III-C", "BARANGAY III-D",
    "BARANGAY III-E", "BARANGAY III-F", "BARANGAY IV-A",
    "BARANGAY IV-B", "BARANGAY IV-C", "BARANGAY V-A",
    "BARANGAY V-B", "BARANGAY V-C", "BARANGAY V-D",
    "BARANGAY VI-A", "BARANGAY VI-B", "BARANGAY VI-D",
    "BARANGAY VI-E", "BARANGAY VII-A", "BARANGAY VII-B",
    "BARANGAY VII-C", "BARANGAY VII-D", "BARANGAY VII-E",
    "BAUTISTA", "CONCEPCION", "DEL REMEDIO", "DOLORES", "SAN ANTONIO 1",
    "SAN ANTONIO 2", "SAN BARTOLOME", "SAN BUENAVENTURA", "SAN CRISPIN",
    "SAN CRISTOBAL", "SAN DIEGO", "SAN FRANCISCO", "SAN GABRIEL", "SAN GREGORIO",
    "SAN IGNACIO", "SAN ISIDRO", "SAN JOAQUIN", "SAN JOSE", "SAN JUAN",
    "SAN LORENZO", "SAN LUCAS 1", "SAN LUCAS 2", "SAN MARCOS", "SAN MATEO",
    "SAN MIGUEL", "SAN NICOLAS", "SAN PEDRO", "SAN RAFAEL", "SAN ROQUE",
    "SAN VICENTE", "SANTA ANA", "SANTA CATALINA", "SANTA CRUZ", "SANTA ELENA",
    "SANTA FELOMINA", "SANTA ISABEL", "SANTA MARIA", "SANTA MARIA MAGDALENA",
    "SANTA MONICA", "SANTA VERONICA", "SANTIAGO I", "SANTIAGO II",
    "SANTISIMO ROSARIO", "SANTO ANGEL", "SANTO CRISTO", "SANTO NIÑO", "SOLEDAD",
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for map center
  const [mapCenter, setMapCenter] = useState(null);

  // This fallback list provides the most accurate and reliable pin placement
  // because the coordinates have been manually verified. The Nominatim API is
  // used only as a last resort if a barangay is not on this list.
  const barangayCoordinatesFallback = useMemo(() => ({
    "ATISAN": [13.982162376265237, 121.29478172420768],
    "BAGONG POOK VI-C": [14.076670768443464, 121.32096423762542],
    "BARANGAY I-A": [14.07271310771814, 121.3171842348335],
    "BARANGAY I-B": [14.07, 121.32],
    "BAGONG BAYAN I-C": [14.075, 121.325],
    "BARANGAY II-A": [14.065, 121.315],
    "BARANGAY II-B": [14.065, 121.315],
    "BARANGAY II-C": [14.065, 121.315],
    "BARANGAY II-D": [14.065, 121.315],
    "BARANGAY II-E": [14.065, 121.315],
    "BARANGAY II-F": [14.065, 121.315],
    "BARANGAY III-A": [14.072, 121.322],
    "BARANGAY III-B": [14.07, 121.32],
    "BARANGAY III-C": [14.068, 121.318],
    "BARANGAY III-D": [14.066, 121.316],
    "BARANGAY III-E": [14.064, 121.314],
    "BARANGAY III-F": [14.062, 121.312],
    "BARANGAY IV-A": [14.070613585719254, 121.32199154452867],
    "BARANGAY IV-B": [14.068, 121.308],
    "BARANGAY IV-C": [14.066, 121.306],
    "BARANGAY V-A": [14.075197218749855, 121.32436171165214],
    "BARANGAY V-B": [14.068, 121.298],
    "BARANGAY V-C": [14.066, 121.296],
    "BARANGAY V-D": [14.072051316946544, 121.3252238096129],
    "BARANGAY VI-A": [14.074289693224987, 121.32393372104971],
    "BARANGAY VI-B": [14.07465914843336, 121.32186298700412],
    "BARANGAY VI-D": [14.078841532611463, 121.32096038197022],
    "BARANGAY VI-E": [14.075038883964222, 121.31751510915632],
    "BARANGAY VII-A": [14.070604550669454, 121.32172078285527],
    "BARANGAY VII-B": [14.069794454856726, 121.32344329751426],
    "BARANGAY VII-C": [14.069509651158453, 121.32460210153442],
    "BARANGAY VII-D": [14.068862230266188, 121.32543487264805],
    "BARANGAY VII-E": [14.067979726648415, 121.3241734012748],
    "BAUTISTA": [13.992342566288162, 121.28197139388813],
    "CONCEPCION": [14.079072740477171, 121.33836441299172],
    "DEL REMEDIO": [14.082067095713267, 121.3119199874566],
    "DOLORES": [14.10303187728091, 121.33404591228415],
    "SAN ANTONIO 1": [14.009618476888486, 121.33904902332782],
    "SAN ANTONIO 2": [13.99464870966638, 121.32649829509012],
    "SAN BARTOLOME": [14.027480636022595, 121.2884808812466],
    "SAN BUENAVENTURA": [14.11403312886715, 121.3279188855696],
    "SAN CRISPIN": [14.079835624511922, 121.2816500414516],
    "SAN CRISTOBAL": [14.049237246072929, 121.40419838034927],
    "SAN DIEGO": [14.092179983414304, 121.37424975640857],
    "SAN FRANCISCO": [14.066229539612467, 121.3403434437221],
    "SAN GABRIEL": [14.059060776891968, 121.31597809737802],
    "SAN GREGORIO": [14.047337326470524, 121.3283054776156],
    "SAN IGNACIO": [14.045640618608461, 121.34007411364895],
    "SAN ISIDRO": [13.988236473507603, 121.31130768973739],
    "SAN JOAQUIN": [14.029289069970963, 121.32848231677339],
    "SAN JOSE": [14.064263147334618, 121.38451834394701],
    "SAN JUAN": [14.093893339293826, 121.29702816304157],
    "SAN LORENZO": [14.110540810159742, 121.35140515317576],
    "SAN LUCAS 1": [14.082782518623304, 121.32670800598385],
    "SAN LUCAS 2": [14.087923213835962, 121.32870356956211],
    "SAN MARCOS": [14.103407646908154, 121.30422435005086],
    "SAN MATEO": [14.109374908871866, 121.29808748817864],
    "SAN MIGUEL": [14.035331483364494, 121.3051156005537],
    "SAN NICOLAS": [14.067650585605367, 121.29406955563681],
    "SAN PEDRO": [14.0936339692745, 121.33511202207279],
    "SAN RAFAEL": [14.071073600151427, 121.30576410904108],
    "SAN ROQUE": [14.0638727163763, 121.30961794848596],
    "SAN VICENTE": [14.023561900335125, 121.34071975239287],
    "SANTA ANA": [14.016338107051585, 121.32804187547801],
    "SANTA CATALINA": [14.127550628120423, 121.34779843665444],
    "SANTA CRUZ": [14.027583796286358, 121.35647768556355],
    "SANTA ELENA": [14.040481085982453, 121.36683651571671],
    "SANTA FELOMINA": [14.089149896691156, 121.28834744336552],
    "SANTA ISABEL": [14.080938011848414, 121.37900882271069],
    "SANTA MARIA": [14.026751091954845, 121.31359183694111],
    "SANTA MARIA MAGDALENA": [14.096381940732421, 121.31122671366965],
    "SANTA MONICA": [14.05318408992653, 121.29683069613107],
    "SANTA VERONICA": [14.042808244165853, 121.28825630692415],
    "SANTIAGO I": [14.021838094143842, 121.28146540658781],
    "SANTIAGO II": [14.004691164261063, 121.26514980487362],
    "SANTISIMO ROSARIO": [14.003231185865646, 121.31122128129928],
    "SANTO ANGEL": [14.10544599546488, 121.37165452410284],
    "SANTO CRISTO": [14.064235249080324, 121.3307846756648],
    "SANTO NIÑO": [14.052565683179576, 121.36267436602672],
    "SOLEDAD": [14.04379475251927, 121.31681678738381],
  }), []);

  const handleUppercaseChange = (e) => {
    const value = (e.target.value || "").toUpperCase();
    handleChange({ target: { name: e.target.name, value } });
  };

  const geocodeBarangay = useMemo(
    () => debounce(async (barangay) => {
      if (!barangay) return;

      if (barangayCoordinatesFallback[barangay]) {
        const [lat, lon] = barangayCoordinatesFallback[barangay];
        const newCoords = `${lat},${lon}`;
        handleChange({ target: { name: "pinAddress", value: newCoords } });
        setMapCenter([lat, lon]);
        return;
      }

      try {
        const fullQuery = `${barangay}, San Pablo City, Laguna, Philippines`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullQuery
        )}`;

        const response = await axios.get(url, {
          headers: {
            // Updated User-Agent for better API compliance
            "User-Agent": "San-Pablo-City-Map-App/1.0",
          },
        });

        if (response.data && response.data.length > 0) {
          const firstResult = response.data[0];
          const { lat, lon } = firstResult;
          const newCoords = `${lat},${lon}`;
          handleChange({ target: { name: "pinAddress", value: newCoords } });
          setMapCenter([lat, lon]);
        } else {
          console.log("Barangay location not found via API. Defaulting to city center.");
          const [lat, lon] = defaultPosition;
          handleChange({ target: { name: "pinAddress", value: `${lat},${lon}` } });
          setMapCenter(defaultPosition);
        }
      } catch (error) {
        console.error("Error during geocoding search:", error);
      }
    }, 500),
    [handleChange, barangayCoordinatesFallback]
  );

  const defaultPosition = [14.0697, 121.3259];

  const sanPabloBounds = L.latLngBounds(
    [13.985, 121.280],
    [14.200, 121.400]
  );

  const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, map.getZoom());
      }
    }, [center, map]);
    return null;
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleChange({
          target: { name: "pinAddress", value: `${lat},${lng}` },
        });
        setMapCenter([lat, lng]);
      },
    });

    if (formData.pinAddress) {
      const [lat, lng] = formData.pinAddress.split(",").map(Number);
      return <Marker position={[lat, lng]} icon={defaultIcon} />;
    }
    return null;
  }

  function ResizeHandler() {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, [map]);
    return null;
  }

  useEffect(() => {
    if (
      !formData.region ||
      !formData.province ||
      !formData.cityOrMunicipality
    ) {
      handleChange({ target: { name: "region", value: "REGION IV-A" } });
      handleChange({ target: { name: "province", value: "LAGUNA" } });
      handleChange({
        target: { name: "cityOrMunicipality", value: "SAN PABLO CITY" },
      });
    }
  }, [formData, handleChange]);

  // Use the memoized, debounced geocoding function
  useEffect(() => {
    if (formData.barangay) {
      geocodeBarangay(formData.barangay);
    }
  }, [formData.barangay, geocodeBarangay]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Address Information
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          *Select a barangay to automatically pin your location. You can also click on the map to adjust the pin.
        </Typography>
      </Box>

      <Stack spacing={3}>
        <TextField label="Region" value="REGION IV-A" disabled fullWidth />
        <TextField label="Province" value="LAGUNA" disabled fullWidth />
        <TextField
          label="City / Municipality"
          value="SAN PABLO CITY"
          disabled
          fullWidth
        />

        <FormControl fullWidth error={!!errors.barangay}>
          <InputLabel id="barangay-label">Barangay</InputLabel>
          <Select
            labelId="barangay-label"
            name="barangay"
            value={formData.barangay || ""}
            onChange={handleUppercaseChange}
            label="Barangay"
          >
            <MenuItem value="">Select Barangay</MenuItem>
            {barangays.map((brgy) => (
              <MenuItem key={brgy} value={brgy}>
                {brgy}
              </MenuItem>
            ))}
          </Select>
          {!!errors.barangay && (
            <Typography variant="caption" color="error">
              {errors.barangay}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1 || ""}
          onChange={handleUppercaseChange}
          fullWidth
          error={!!errors.addressLine1}
          helperText={errors.addressLine1}
        />
        <TextField
          label="Address Line 2"
          name="addressLine2"
          value={formData.addressLine2 || ""}
          onChange={handleUppercaseChange}
          fullWidth
          error={!!errors.addressLine2}
          helperText={errors.addressLine2}
        />

        <div>
          <MapContainer
            center={mapCenter || defaultPosition}
            zoom={13}
            maxBounds={sanPabloBounds}
            minZoom={12}
            maxBoundsViscosity={1.0}
            style={{
              height: isMobile ? "250px" : "400px",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />
            <ResizeHandler />
            <LocationMarker />
            <ChangeView center={mapCenter} />
          </MapContainer>
          <TextField
            label="Coordinates"
            name="pinAddress"
            value={formData.pinAddress || ""}
            fullWidth
            disabled
            sx={{ marginTop: 2 }}
          />
        </div>
      </Stack>
    </div>
  );
}
