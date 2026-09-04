export interface Departure {
  day: string;
  month: string;
}

const MONTHS_ES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];

export const departuresConfig = {
  apiUrl: import.meta.env.PUBLIC_LANDING_CONSOLIDADO_DEPARTURES_ENDPOINT ?? '',
  formToken: import.meta.env.PUBLIC_LANDING_CONSOLIDADO_FORM_TOKEN ?? '',
};

interface DeparturesApiItem {
  closeDate?: string | null;
}

interface DeparturesApiResponse {
  success?: boolean;
  data?: DeparturesApiItem[];
}

function toDeparture(isoDate: string): Departure {
  const date = new Date(`${isoDate}T00:00:00`);
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MONTHS_ES[date.getMonth()],
  };
}

export async function fetchNextDepartures(limit = 2): Promise<Departure[] | null> {
  if (!departuresConfig.apiUrl || !departuresConfig.formToken) return null;

  try {
    const url = new URL(departuresConfig.apiUrl);
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${departuresConfig.formToken}` },
    });

    if (!response.ok) return null;

    const json: DeparturesApiResponse = await response.json();
    if (!json.success || !Array.isArray(json.data)) return null;

    const departures = json.data
      .map((item) => item.closeDate)
      .filter((closeDate): closeDate is string => Boolean(closeDate))
      .map(toDeparture);

    return departures.length > 0 ? departures : null;
  } catch {
    return null;
  }
}
