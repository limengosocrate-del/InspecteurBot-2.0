/* ==================================================================
   GPS.JS — Géolocalisation et gestion des missions
   ================================================================== */

const GPS = {

  currentPosition: null,

  async getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("GPS non supporté");
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.currentPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          resolve(this.currentPosition);
        },
        err => reject(err.message),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  },

  // Reverse geocoding (Nominatim OpenStreetMap gratuit)
  async getAddress(lat, lng) {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const d = await r.json();
      return d.display_name || "Adresse inconnue";
    } catch(e) { return "Erreur géocodage"; }
  },

  // Distance Haversine (km)
  distance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2-lat1) * Math.PI/180;
    const dLng = (lng2-lng1) * Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  },

  // Enregistrer une position (mission)
  saveMission(nom, notes = "") {
    if (!this.currentPosition) return null;
    const missions = JSON.parse(localStorage.getItem("igt_missions") || "[]");
    const m = {
      id: "M-" + Date.now(),
      nom, notes,
      ...this.currentPosition
    };
    missions.unshift(m);
    localStorage.setItem("igt_missions", JSON.stringify(missions.slice(0,500)));
    return m;
  },

  getMissions() {
    return JSON.parse(localStorage.getItem("igt_missions") || "[]");
  }
};

if (typeof window !== 'undefined') window.GPS = GPS;
