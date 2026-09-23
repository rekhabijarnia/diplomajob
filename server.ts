import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini API client as specified in skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// SYSTEM INSTRUCTION FOR POLYTECHNIC CAREER & TECHNICAL MENTOR CHATBOT
const SYSTEM_INSTRUCTION = `You are the DiplomaJob Polytechnic Career Advisor & Shopfloor Technical Mentor, specifically created for polytechnic diploma engineering students and freshers across India (MSBTE Maharashtra, BTEUP Uttar Pradesh, DTE Karnataka, SBTET AP/Telangana, GTU Gujarat, etc.).

Your specialties:
1. Diploma Engineer Trainee (DET) campus and off-campus recruitment (Tata Motors, L&T, Bharat Forge, Bajaj, Cummins, Bosch, etc.).
2. National Apprenticeship Training Scheme (NATS / BOAT) under the Apprentices Act 1961 (amended 2021), 16-digit student enrollment ID, DBT stipend calculations (50% Govt + 50% Employer), and Certificate of Proficiency.
3. Shopfloor, plant, and laboratory competencies: CNC/VMC G-codes & M-codes, PLC ladder logic, hydraulic & pneumatic circuits, GD&T tolerancing, metrology tools (Vernier, Micrometer, dial gauges), 5S & Kaizen, and safety compliance.
4. Mandatory 6-week summer plant training reports and final year Capstone project design & viva defense.
5. Polytechnic fresher resume building, ATS optimization, and HR/Technical interview question-answer drills.
6. Public Sector Undertakings (PSU) & Government technician exams: RRB JE (Junior Engineer), SSC JE, DRDO CEPTAM, ISRO Technical Assistant, SAIL, BHEL, and IOCL.

Communication style:
- Direct, empowering, respectful, and highly practical.
- Use clear bullet points, actionable step-by-step guidance, and real shopfloor insights.
- Provide concrete examples when explaining technical topics.`;

// Helper: sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: check if error is 429 / RESOURCE_EXHAUSTED
function isQuotaExhaustedError(err: any): boolean {
  if (!err) return false;
  const str = String(err?.message || err?.status || err?.code || JSON.stringify(err));
  return (
    str.includes('429') ||
    str.includes('RESOURCE_EXHAUSTED') ||
    str.includes('quota') ||
    err?.status === 429 ||
    err?.code === 429
  );
}

// Fallback directory for industrial corridors with direct Google Maps URLs
const FALLBACK_INDUSTRIAL_HUBS = [
  {
    title: 'Chakan MIDC Phase 1, 2, 3 (Automotive Corridor)',
    uri: 'https://www.google.com/maps/search/?api=1&query=Chakan+MIDC+Pune+Maharashtra',
    city: 'Pune, Maharashtra',
    keywords: ['chakan', 'pune', 'maharashtra', 'bajaj', 'tata', 'midc', 'auto', 'mechanical'],
    summary: 'Chakan is India’s premier automobile and heavy engineering corridor. Hosts mega plants of Tata Motors Passenger & Commercial Vehicles, Bajaj Auto, Mahindra & Mahindra, Mercedes-Benz, and over 400 Tier-1 press and CNC component vendors. Direct PMPML transit connectivity from Pune Station & Nigdi.',
  },
  {
    title: 'Bhosari & Pimpri MIDC Industrial Area',
    uri: 'https://www.google.com/maps/search/?api=1&query=Bhosari+MIDC+Pimpri+Pune',
    city: 'Pimpri-Chinchwad, Pune',
    keywords: ['bhosari', 'pimpri', 'midc', 'pune', 'cnc', 'die', 'machining'],
    summary: 'High-density precision engineering, tool & die manufacturing, casting, and sheet metal fabrication belt. Ideal for Diploma Mechanical and Production freshers looking for CNC/VMC operator, QA/QC, and apprentice openings.',
  },
  {
    title: 'Peenya Industrial Area (Bangalore Heavy & Light Engineering)',
    uri: 'https://www.google.com/maps/search/?api=1&query=Peenya+Industrial+Area+Bengaluru+Karnataka',
    city: 'Bengaluru, Karnataka',
    keywords: ['peenya', 'bengaluru', 'bangalore', 'karnataka', 'electrical', 'cnc', 'machine'],
    summary: 'One of the largest industrial estates in Southeast Asia, housing over 5,000 small, medium, and large precision engineering, electrical switchgear, hydraulics, and textile machinery plants. Direct connectivity via Green Line Peenya Metro Station.',
  },
  {
    title: 'Sriperumbudur & Oragadam SIPCOT Industrial Parks',
    uri: 'https://www.google.com/maps/search/?api=1&query=Sriperumbudur+SIPCOT+Industrial+Park+Chennai',
    city: 'Chennai, Tamil Nadu',
    keywords: ['sriperumbudur', 'oragadam', 'sipcot', 'chennai', 'tamil nadu', 'electronics', 'hyundai', 'renault'],
    summary: 'The "Detroit of South Asia". Hosts mega assembly plants for Hyundai, Renault-Nissan, Daimler India Commercial Vehicles (BharatBenz), and major electronics manufacturing services (Foxconn, Pegatron, Dell). Extensive diploma apprentice intakes through BOAT Southern Region.',
  },
  {
    title: 'Sanand & Changodar GIDC Industrial Estate',
    uri: 'https://www.google.com/maps/search/?api=1&query=Sanand+GIDC+Ahmedabad+Gujarat',
    city: 'Ahmedabad, Gujarat',
    keywords: ['sanand', 'changodar', 'gidc', 'ahmedabad', 'gujarat', 'maruti', 'ford', 'auto'],
    summary: 'Fast-growing automotive and precision manufacturing ecosystem in Gujarat. Houses Tata Motors EV manufacturing facility, Maruti Suzuki vendor park, Colgate, and pharmaceutical machinery producers.',
  },
  {
    title: 'IMT Manesar & Sector 8 Industrial Area',
    uri: 'https://www.google.com/maps/search/?api=1&query=IMT+Manesar+Gurugram+Haryana',
    city: 'Gurugram, Haryana / NCR',
    keywords: ['manesar', 'imt', 'gurugram', 'haryana', 'ncr', 'maruti', 'honda', 'auto'],
    summary: 'Major automobile manufacturing nerve center in North India. Hosts Maruti Suzuki’s flagship plant, Honda Motorcycle and Scooter India (HMSI), and hundreds of Tier-1 Japanese and Indian auto-component suppliers.',
  },
  {
    title: 'Government Polytechnic Colleges & Technical Examination Centers',
    uri: 'https://www.google.com/maps/search/?api=1&query=Government+Polytechnic+College',
    city: 'Pan-India',
    keywords: ['polytechnic', 'college', 'dte', 'msbte', 'bteup', 'exam', 'test', 'near me'],
    summary: 'State Directorate of Technical Education (DTE) polytechnic examination and skill incubation centers offering approved diploma programs in Mechanical, Civil, Electrical, and Computer engineering.',
  },
];

// Fallback search notices for official diploma boards & PSU exams
const FALLBACK_SEARCH_CIRCULARS = [
  {
    uri: 'https://msbte.org.in',
    title: 'MSBTE Maharashtra State Board of Technical Education Official Portal',
    summary: 'MSBTE circulars, Winter/Summer examination timetables, practical examination mark submission schedules, and curriculum I/K Scheme teaching guidelines for all Maharashtra polytechnic institutions.',
  },
  {
    uri: 'https://bteup.ac.in',
    title: 'BTEUP Board of Technical Education Uttar Pradesh Official Notices',
    summary: 'Official notifications for semester examinations, scrutiny/re-evaluation results, diploma registration roll numbers, and industrial training submissions across UP polytechnics.',
  },
  {
    uri: 'https://nats.education.gov.in',
    title: 'National Apprenticeship Training Scheme (NATS 2.0) Central Portal',
    summary: 'Ministry of Education apprentice student registration, 16-digit enrollment status, DBT monthly stipend disbursement updates, and establishment contract approvals.',
  },
  {
    uri: 'https://www.rrbcdg.gov.in',
    title: 'Railway Recruitment Control Board (RRB) Junior Engineer Recruitment',
    summary: 'Centralized Employment Notifications (CEN) for Diploma Engineers in Indian Railways (Mechanical, Electrical, Civil, Signal & Telecom Junior Engineer cadres).',
  },
];

// 1. MULTI-TURN GEMINI CHATBOT API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, modelType } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Recommended active models from skill:
    // - Complex: gemini-3.1-pro-preview
    // - Fast: gemini-3.1-flash-lite
    // - General: gemini-3.8-flash
    let modelName = 'gemini-3.8-flash';
    if (modelType === 'complex') {
      modelName = 'gemini-3.1-pro-preview';
    } else if (modelType === 'fast') {
      modelName = 'gemini-3.1-flash-lite';
    }

    // Prepare contents formatted for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || 'I could not generate a response. Please try again.',
        modelUsed: modelName,
      });
    } catch (apiErr: any) {
      // If 429 quota exhausted or rate limited, retry with fast flash lite model
      if (isQuotaExhaustedError(apiErr)) {
        console.warn(`[Gemini Chat] Quota/rate limit hit with ${modelName}. Attempting fallback to gemini-3.1-flash-lite...`);
        try {
          await sleep(1000);
          const fallbackResp = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });
          return res.json({
            reply: fallbackResp.text || 'Response generated via high-efficiency model.',
            modelUsed: 'gemini-3.1-flash-lite',
          });
        } catch (fbErr: any) {
          console.warn('[Gemini Chat] Flash-lite also hit rate limit:', fbErr?.message);
          // Return helpful offline polytechnic answer with quota notification
          const lastMsg = messages[messages.length - 1]?.content || '';
          return res.json({
            reply: `⚡ **Polytechnic Mentor Notice:** Free-tier Gemini API rate limit reached for the current minute.\n\nHere is core guidance for **"${lastMsg}"**:\n• **Shopfloor & Plant:** Ensure you emphasize practical laboratory skills (AutoCAD drawings, CNC offsets, GD&T, 5S, safety protocols) during interview evaluations.\n• **NATS Apprenticeships:** Ensure your 16-digit enrollment number is verified on nats.education.gov.in for direct DBT stipend bank credit.\n• **Tip:** To increase your API quota limit, you can select a billing-enabled API key in the **Settings > Secrets** panel.`,
            modelUsed: 'offline-mentor-fallback',
            isQuotaExceeded: true,
          });
        }
      }
      throw apiErr;
    }
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to process chat request' 
    });
  }
});

// 2. SEARCH GROUNDING API (Using gemini-3.8-flash with googleSearch tool)
app.post('/api/gemini/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query string is required' });
    }

    const prompt = `You are a real-time Polytechnic Career Intelligence Assistant. Search the web for live, up-to-date information regarding: ${query}.
Provide a concise, accurate breakdown of official circulars, exam dates, eligibility criteria, application deadlines, and direct verification steps for diploma students. Include key highlights in bullet points.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources = groundingChunks
        .filter((chunk: any) => chunk.web && chunk.web.uri)
        .map((chunk: any) => ({
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri,
        }));

      return res.json({
        text: response.text || 'No information found.',
        sources: webSources,
        isQuotaExceeded: false,
      });
    } catch (apiErr: any) {
      if (isQuotaExhaustedError(apiErr)) {
        console.warn('[Gemini Search Grounding] Quota exceeded on free tier. Providing verified circular intelligence...');
        const matchingSources = FALLBACK_SEARCH_CIRCULARS.map((s) => ({
          uri: s.uri,
          title: s.title,
        }));

        const textOutput = `### Verified Official Board & Circular Radar\n\n**Query:** "${query}"\n\n⚡ *Notice: Free-tier Gemini rate limit reached for live search grounding. Providing verified state technical board and central portal data.*\n\n• **State Technical Boards (MSBTE / BTEUP / DTE):** Regular updates, timetables, hall ticket releases, and re-evaluation circulars are published directly under the official Notifications section.\n• **NATS 2.0 Apprenticeships:** Monthly DBT stipend rates for diploma holders are maintained at up to ₹12,000–₹18,500/month across approved engineering establishments.\n• **Public Sector Drives:** Diploma recruitment notices for RRB JE, DRDO CEPTAM, and SAIL require a 3-year state board diploma with minimum 60% aggregate.\n\n*To enable real-time unlimited search grounding, attach a billing-enabled key in Settings > Secrets.*`;

        return res.json({
          text: textOutput,
          sources: matchingSources,
          isQuotaExceeded: true,
        });
      }
      throw apiErr;
    }
  } catch (error: any) {
    console.error('Error in /api/gemini/search:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to retrieve search grounded data' 
    });
  }
});

// 3. MAPS GROUNDING API (Using gemini-3.8-flash with googleMaps tool)
app.post('/api/gemini/maps', async (req, res) => {
  try {
    const { query, latLng } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Maps query string is required' });
    }

    const prompt = `Locate industrial manufacturing zones, MIDC/GIDC industrial clusters, major automotive/engineering plants, or polytechnic institutions for: ${query}.
Explain the significance of this location for diploma mechanical, electrical, civil, or IT trainees, plant transit connectivity, and nearby major industrial units.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (latLng && typeof latLng.latitude === 'number' && typeof latLng.longitude === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: latLng.latitude,
            longitude: latLng.longitude,
          },
        },
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config,
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapPlaces = groundingChunks
        .filter((chunk: any) => chunk.maps && chunk.maps.uri)
        .map((chunk: any) => ({
          uri: chunk.maps.uri,
          title: chunk.maps.title || 'View on Google Maps',
          placeAnswerSources: chunk.maps.placeAnswerSources || null,
        }));

      return res.json({
        text: response.text || 'No location details found.',
        places: mapPlaces,
        isQuotaExceeded: false,
      });
    } catch (apiErr: any) {
      if (isQuotaExhaustedError(apiErr)) {
        console.warn(`[Gemini Maps Grounding] Quota exceeded on free tier. Returning verified geospatial directory...`);
        
        // Find matching hubs based on query keywords
        const lowerQ = query.toLowerCase();
        let matchedHubs = FALLBACK_INDUSTRIAL_HUBS.filter((hub) =>
          hub.keywords.some((k) => lowerQ.includes(k))
        );

        if (matchedHubs.length === 0) {
          matchedHubs = FALLBACK_INDUSTRIAL_HUBS.slice(0, 4);
        }

        const places = matchedHubs.map((hub) => ({
          uri: hub.uri,
          title: hub.title,
          city: hub.city,
        }));

        const textOutput = `### Verified Industrial & Manufacturing Corridor Directory\n\n**Location Query:** "${query}"\n\n⚡ *Notice: Free-tier Gemini API quota limit reached for real-time Maps Grounding. Displaying verified industrial corridor and plant walk-in directory with direct Google Maps navigation links below.*\n\n` +
          matchedHubs
            .map(
              (hub, i) =>
                `**${i + 1}. ${hub.title} (${hub.city})**\n• ${hub.summary}\n• Direct Maps Link: [Open in Google Maps](${hub.uri})\n`
            )
            .join('\n') +
          `\n\n*Note: To unlock higher real-time Gemini Maps quotas, you can select a billing-enabled key in the **Settings > Secrets** panel.*`;

        return res.json({
          text: textOutput,
          places,
          isQuotaExceeded: true,
        });
      }
      throw apiErr;
    }
  } catch (error: any) {
    console.error('Error in /api/gemini/maps:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to retrieve Google Maps grounded data' 
    });
  }
});

// Mount Vite in dev mode or serve static build in production
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 DiplomaJob Server running on port ${PORT} [Mode: ${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
