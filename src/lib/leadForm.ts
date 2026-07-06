export const leadFormConfig = {
  apiUrl:
    import.meta.env.PUBLIC_LANDING_CONSOLIDADO_LEAD_ENDPOINT ??
    import.meta.env.PUBLIC_LANDING_CONSOLIDADO_API_URL ??
    '',
  formToken: import.meta.env.PUBLIC_LANDING_CONSOLIDADO_FORM_TOKEN ?? '',
  campaignCode: import.meta.env.PUBLIC_LANDING_CONSOLIDADO_CAMPAIGN_CODE ?? 'jun2026',
  graciasPath: '/gracias',
};
