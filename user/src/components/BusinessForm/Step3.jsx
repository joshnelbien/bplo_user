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

export default function Step3AddressInfo({ formData, handleChange, errors }) {
  const barangays = [
    "ATISAN",
    "BAGONG POOK VI-C (POB.)",
    "BARANGAY I-A (POB.)",
    "BARANGAY I-B (POB.)",
    "BAGONG BAYAN I-C (POB.)",
    "BARANGAY II-A (POB.)",
    "BARANGAY II-B (POB.)",
    "BARANGAY II-C (POB.)",
    "BARANGAY II-D (POB.)",
    "BARANGAY II-E (POB.)",
    "BARANGAY II-F (POB.)",
    "BARANGAY III-A (POB.)",
    "BARANGAY III-B (POB.)",
    "BARANGAY III-C (POB.)",
    "BARANGAY III-D (POB.)",
    "BARANGAY III-E (POB.)",
    "BARANGAY III-F (POB.)",
    "BARANGAY IV-A (POB.)",
    "BARANGAY IV-B (POB.)",
    "BARANGAY IV-C (POB.)",
    "BARANGAY V-A (POB.)",
    "BARANGAY V-B (POB.)",
    "BARANGAY V-C (POB.)",
    "BARANGAY V-D (POB.)",
    "BARANGAY VI-A (POB.)",
    "BARANGAY VI-B (POB.)",
    "BARANGAY VI-D (POB.)",
    "BARANGAY VI-E (POB.)",
    "BARANGAY VII-A (POB.)",
    "BARANGAY VII-B (POB.)",
    "BARANGAY VII-C (POB.)",
    "BARANGAY VII-D (POB.)",
    "BARANGAY VII-E (POB.)",
    "BAUTISTA",
    "CONCEPCION",
    "DEL REMEDIO",
    "DOLORES",
    "SAN ANTONIO 1",
    "SAN ANTONIO 2",
    "SAN BARTOLOME",
    "SAN BUENAVENTURA",
    "SAN CRISPIN",
    "SAN CRISTOBAL",
    "SAN DIEGO",
    "SAN FRANCISCO",
    "SAN GABRIEL",
    "SAN GREGORIO",
    "SAN IGNACIO",
    "SAN ISIDRO",
    "SAN JOAQUIN",
    "SAN JOSE",
    "SAN JUAN",
    "SAN LORENZO",
    "SAN LUCAS 1",
    "SAN LUCAS 2",
    "SAN MARCOS",
    "SAN MATEO",
    "SAN MIGUEL",
    "SAN NICOLAS",
    "SAN PEDRO",
    "SAN RAFAEL",
    "SAN ROQUE",
    "SAN VICENTE",
    "SANTA ANA",
    "SANTA CATALINA",
    "SANTA CRUZ",
    "SANTA ELENA",
    "SANTA FELOMINA",
    "SANTA ISABEL",
    "SANTA MARIA",
    "SANTA MARIA MAGDALENA",
    "SANTA MONICA",
    "SANTA VERONICA",
    "SANTIAGO I",
    "SANTIAGO II",
    "SANTISIMO ROSARIO",
    "SANTO ANGEL",
    "SANTO CRISTO",
    "SANTO NIÑO",
    "SOLEDAD",
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Default coordinates (San Pablo City center)
  const defaultPosition = [14.0697, 121.3259];

  // Barangay coordinates fallback
  const barangayCoordinatesFallback = useMemo(() => ({
    "ATISAN": [13.982162376265237, 121.29478172420768],
    "BAGONG POOK VI-C (POB.)": [14.076670768443464, 121.32096423762542],
    "BARANGAY I-A (POB.)": [14.07271310771814, 121.3171842348335],
    "BARANGAY I-B (POB.)": [14.07, 121.32],
    "BAGONG BAYAN I-C (POB.)": [14.075, 121.325],
    "BARANGAY II-A (POB.)": [14.065, 121.315],
    "BARANGAY II-B (POB.)": [14.065, 121.315],
    "BARANGAY II-C (POB.)": [14.065, 121.315],
    "BARANGAY II-D (POB.)": [14.065, 121.315],
    "BARANGAY II-E (POB.)": [14.065, 121.315],
    "BARANGAY II-F (POB.)": [14.065, 121.315],
    "BARANGAY III-A (POB.)": [14.072, 121.322],
    "BARANGAY III-B (POB.)": [14.07, 121.32],
    "BARANGAY III-C (POB.)": [14.068, 121.318],
    "BARANGAY III-D (POB.)": [14.066, 121.316],
    "BARANGAY III-E (POB.)": [14.064, 121.314],
    "BARANGAY III-F (POB.)": [14.062, 121.312],
    "BARANGAY IV-A (POB.)": [14.070613585719254, 121.32199154452867],
    "BARANGAY IV-B (POB.)": [14.068, 121.308],
    "BARANGAY IV-C (POB.)": [14.066, 121.306],
    "BARANGAY V-A (POB.)": [14.075197218749855, 121.32436171165214],
    "BARANGAY V-B (POB.)": [14.068, 121.298],
    "BARANGAY V-C (POB.)": [14.066, 121.296],
    "BARANGAY V-D (POB.)": [14.072051316946544, 121.3252238096129],
    "BARANGAY VI-A (POB.)": [14.074289693224987, 121.32393372104971],
    "BARANGAY VI-B (POB.)": [14.07465914843336, 121.32186298700412],
    "BARANGAY VI-D (POB.)": [14.078841532611463, 121.32096038197022],
    "BARANGAY VI-E (POB.)": [14.075038883964222, 121.31751510915632],
    "BARANGAY VII-A (POB.)": [14.070604550669454, 121.32172078285527],
    "BARANGAY VII-B (POB.)": [14.069794454856726, 121.32344329751426],
    "BARANGAY VII-C (POB.)": [14.069509651158453, 121.32460210153442],
    "BARANGAY VII-D (POB.)": [14.068862230266188, 121.32543487264805],
    "BARANGAY VII-E (POB.)": [14.067979726648415, 121.3241734012748],
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

  // State for map center
  const [mapCenter, setMapCenter] = useState(defaultPosition);

  // Uppercase handler
  const handleUppercaseChange = (e) => {
    const value = (e.target.value || "").toUpperCase();
    handleChange({ target: { name: e.target.name, value } });
  };

  // Geocode barangay
  const geocodeBarangay = useMemo(
    () =>
      debounce(async (barangay) => {
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
            console.warn(
              "Barangay location not found via API. Defaulting to city center."
            );
            const [lat, lon] = defaultPosition;
            handleChange({
              target: { name: "pinAddress", value: `${lat},${lon}` },
            });
            setMapCenter(defaultPosition);
          }
        } catch (error) {
          console.error("Error during geocoding search:", error);
        }
      }, 500),
    [handleChange, barangayCoordinatesFallback]
  );

  // Fix Leaflet default marker
  const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Custom component for handling clicks
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

  // Component to update map view
  function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, map.getZoom());
      }
    }, [center, map]);
    return null;
  }

  // Force map to refresh after load (fixes blank/grey tiles)
  function ResizeHandler() {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, [map]);
    return null;
  }

  // Auto-set fixed values
  useEffect(() => {
    if (
      !formData.region ||
      !formData.province ||
      !formData.cityOrMunicipality ||
      !formData.zipCode
    ) {
      handleChange({ target: { name: "region", value: "REGION IV-A" } });
      handleChange({ target: { name: "province", value: "LAGUNA" } });
      handleChange({
        target: { name: "cityOrMunicipality", value: "SAN PABLO CITY" },
      });
      handleChange({ target: { name: "zipCode", value: "4000" } });
    }
  }, [formData, handleChange]);

  // Trigger geocoding when barangay changes
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

        <TextField label="Zip Code" value="4000" disabled fullWidth />

        <div>
          <Typography variant="subtitle1" gutterBottom>
            Pin Address (Click on the map)
          </Typography>
          <MapContainer
            center={mapCenter}
            zoom={13}
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

        <FormControl fullWidth sx={{ minWidth: 300 }} error={!!errors.ownPlace}>
          <InputLabel id="own-place-label">Own Place</InputLabel>
          <Select
            labelId="own-place-label"
            name="ownPlace"
            value={formData.ownPlace || ""}
            onChange={handleUppercaseChange}
            label="Own Place"
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="YES">YES</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
          </Select>
          {!!errors.ownPlace && (
            <Typography variant="caption" color="error">
              {errors.ownPlace}
            </Typography>
          )}
        </FormControl>

        {formData.ownPlace === "YES" && (
          <TextField
            label="Tax Declaration No."
            name="taxdec"
            value={formData.taxdec || ""}
            onChange={handleUppercaseChange}
            fullWidth
            variant="outlined"
            error={!!errors.taxdec}
            helperText={errors.taxdec}
          />
        )}

        {formData.ownPlace === "NO" && (
          <Stack spacing={3}>
            <Typography variant="subtitle1">Owner’s Address</Typography>
            <TextField
              label="Lessor's Name"
              name="lessorName"
              value={formData.lessorName || ""}
              onChange={handleUppercaseChange}
              fullWidth
              variant="outlined"
              error={!!errors.lessorName}
              helperText={errors.lessorName}
            />
            <TextField
              label="Monthly Rental"
              name="monthlyRent"
              value={formData.monthlyRent || ""}
              onChange={handleUppercaseChange}
              fullWidth
              variant="outlined"
              error={!!errors.monthlyRent}
              helperText={errors.monthlyRent}
            />
            <TextField
              label="Tax Declaration No."
              name="taxdec"
              value={formData.taxdec || ""}
              onChange={handleUppercaseChange}
              fullWidth
              variant="outlined"
              error={!!errors.taxdec}
              helperText={errors.taxdec}
            />
          </Stack>
        )}
      </Stack>
    </div>
  );
}