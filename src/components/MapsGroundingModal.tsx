import React, { useState } from 'react';

interface MapPlace {
  uri: string;
  title: string;
  city?: string;
  placeAnswerSources?: any;
}

interface MapsGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapsGroundingModal: React.FC<MapsGroundingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mapQuery, setMapQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapsResult, setMapsResult] = useState<string | null>(null);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  if (!isOpen) return null;

  const industrialCorridors = [
    {
      title: 'Chakan & Bhosari MIDC (Pune)',
      query: 'Chakan MIDC Phase 1 2 3 and Bhosari Industrial Area automotive manufacturing plants Tata Motors Bajaj Pune',
    },
    {
      title: 'Peenya Industrial Area (Bengaluru)',
      query: 'Peenya Industrial Area CNC machining heavy engineering electrical manufacturing units Bengaluru',
    },
    {
      title: 'Sriperumbudur & Oragadam (Chennai)',
      query: 'Sriperumbudur and Oragadam SIPCOT automotive electronics manufacturing corridor Chennai',
    },
    {
      title: 'Sanand & Changodar GIDC (Gujarat)',
      query: 'Sanand GIDC automobile engineering manufacturing plant hub Ahmedabad Gujarat',
    },
    {
      title: 'Manesar & IMT Gurgaon (NCR)',
      query: 'IMT Manesar industrial manufacturing estate automobile auto-component plants Haryana NCR',
    },
    {
      title: 'Govt Polytechnic Colleges Near Me',
      query: 'Government Polytechnic colleges and technical test examination centers in Pune Maharashtra',
    },
  ];

  const handleExecuteMapSearch = async (queryText: string, useGeo = false) => {
    const q = queryText.trim();
    if (!q && !useGeo) return;

    setIsLoading(true);
    setMapsResult(null);
    setPlaces([]);
    setIsQuotaExceeded(false);

    let latLng: { latitude: number; longitude: number } | undefined = undefined;

    if (useGeo && 'geolocation' in navigator) {
      setLocationStatus('Getting your GPS coordinates...');
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
        });
        latLng = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocationStatus(`Using your location: ${latLng.latitude.toFixed(2)}, ${latLng.longitude.toFixed(2)}`);
      } catch {
        setLocationStatus('Location access optional; searching default industrial corridor');
      }
    }

    try {
      const response = await fetch('/api/gemini/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q || 'Major engineering manufacturing plants and industrial zones nearby',
          latLng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Server returned error code: ${response.status}`);
      }

      setMapsResult(data.text);
      setPlaces(data.places || []);
      setIsQuotaExceeded(data.isQuotaExceeded || false);
    } catch (err: any) {
      console.error('Maps grounding error:', err);
      setMapsResult(`⚠️ Error retrieving maps grounded data: ${err.message || 'Please check network and try again'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-low px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">pin_drop</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface">Industrial Corridor & Plant Locator</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Google Maps Grounded
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Find MIDC/GIDC manufacturing clusters, polytechnic colleges, and walk-in plant locations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteMapSearch(mapQuery);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                location_city
              </span>
              <input
                type="text"
                value={mapQuery}
                onChange={(e) => setMapQuery(e.target.value)}
                placeholder="Search MIDC / GIDC clusters, factory gates, test centers..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading || !mapQuery.trim()}
                className="px-4 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Find Places</span>
                <span className="material-symbols-outlined text-[16px]">map</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMapQuery('Industrial MIDC areas and engineering factories near me');
                  handleExecuteMapSearch('Industrial MIDC areas and engineering factories near me', true);
                }}
                disabled={isLoading}
                title="Search near my current coordinates"
                className="px-3 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold border border-outline-variant/30 flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">my_location</span>
                <span className="hidden sm:inline">Near Me</span>
              </button>
            </div>
          </form>

          {locationStatus && (
            <p className="text-[11px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">gps_fixed</span>
              {locationStatus}
            </p>
          )}

          {/* Quick preset corridors */}
          <div>
            <span className="text-xs font-semibold text-on-surface-variant block mb-2">
              Key Industrial & Manufacturing Hubs:
            </span>
            <div className="flex flex-wrap gap-2">
              {industrialCorridors.map((corridor, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMapQuery(corridor.query);
                    handleExecuteMapSearch(corridor.query);
                  }}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium rounded-lg border border-outline-variant/30 flex items-center gap-1.5 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[14px] text-secondary">domain</span>
                  <span>{corridor.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quota limit indicator banner if applicable */}
          {isQuotaExceeded && (
            <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">
                info
              </span>
              <div>
                <p className="font-bold text-amber-300">Rate Limit Notice (Free Tier)</p>
                <p className="text-[11px] mt-0.5 text-amber-200/90">
                  Gemini API rate limit reached for live maps grounding. Showing verified industrial corridors with direct Google Maps navigation links. You can attach a billing-enabled key in <strong>Settings &gt; Secrets</strong> for higher rate limits.
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-bold text-on-surface">Locating industrial zones with Google Maps Grounding...</p>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Retrieving geographic coordinates, factory clusters, and public transit links
              </p>
            </div>
          )}

          {/* Maps output results */}
          {!isLoading && mapsResult && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-surface-container-low p-4 sm:p-5 rounded-xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    Geographic Plant Intelligence
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                  {mapsResult}
                </div>
              </div>

              {/* ALWAYS EXTRACT URLS AND LIST ON WEB APP AS REQUIRED BY SKILL */}
              {places.length > 0 && (
                <div className="bg-surface-container-low/70 p-4 rounded-xl border border-outline-variant/30">
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 mb-2.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
                    Identified Locations & Maps Directions ({places.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {places.map((place, idx) => (
                      <a
                        key={idx}
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-surface-container hover:bg-surface-container-high rounded-xl border border-outline-variant/30 transition-colors flex items-start gap-2.5 group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[16px]">place</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            {place.title}
                          </p>
                          {place.city && (
                            <p className="text-[10px] text-on-surface-variant truncate">
                              {place.city}
                            </p>
                          )}
                          <p className="text-[10px] text-secondary flex items-center gap-1 mt-0.5">
                            <span>Open in Google Maps</span>
                            <span className="material-symbols-outlined text-[12px]">launch</span>
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
