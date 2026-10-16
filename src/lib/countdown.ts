export const countdownConfig = {
  apiUrl: import.meta.env.PUBLIC_LANDING_CONSOLIDADO_COUNTDOWN_ENDPOINT ?? '',
  formToken: import.meta.env.PUBLIC_LANDING_CONSOLIDADO_FORM_TOKEN ?? '',
  /** Fallback si la API no responde (misma fecha que había en crudo). */
  fallbackEndsAt: '2026-10-06T23:59:59-05:00',
};

interface CountdownApiResponse {
  success?: boolean;
  data?: {
    ends_at?: string | null;
    timezone?: string | null;
  };
}

export async function fetchCountdownEndsAt(): Promise<string> {
  if (!countdownConfig.apiUrl || !countdownConfig.formToken) {
    return countdownConfig.fallbackEndsAt;
  }

  try {
    const response = await fetch(countdownConfig.apiUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${countdownConfig.formToken}`,
      },
    });

    if (!response.ok) return countdownConfig.fallbackEndsAt;

    const json: CountdownApiResponse = await response.json();
    const endsAt = json.data?.ends_at?.trim();
    if (!json.success || !endsAt) return countdownConfig.fallbackEndsAt;

    return endsAt;
  } catch {
    return countdownConfig.fallbackEndsAt;
  }
}
