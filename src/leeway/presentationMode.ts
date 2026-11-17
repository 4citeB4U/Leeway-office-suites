/**
 * LEEWAY HEADER — DO NOT REMOVE
 * REGION: LEEWAY.OFFICE.PRESENTATION
 * TAG: LEEWAY.OFFICE.HOST_SURFACE_V1
 * 5WH: WHAT=Select the original Office capability-only surface for tablet and native widget hosts.
 * WHY=Prevent nested full-desktop chrome and duplicated tablet navigation.
 * WHO=Creator-directed W01 Office integration.
 * WHERE=src/leeway/presentationMode.ts.
 * WHEN=2026-11-17.
 * HOW=Pure, non-authoritative display-mode resolution from embed context and explicit host hint.
 * AUTHORITY=Presentation only; no command, authentication, or capability admission.
 * LICENSE=Apache-2.0.
 */
export type OfficePresentationMode = 'standalone' | 'embedded';

export function resolveOfficePresentationMode(
  search: string,
  isEmbeddedFrame: boolean,
): OfficePresentationMode {
  const requested = new URLSearchParams(search).get('leewaySurface');
  // Native standalone Office retains its original shell; embedded app views
  // inherit chrome, navigation and placement from the approved LeeWay host.
  return isEmbeddedFrame || requested === 'widget' ||
    requested === 'tablet' || requested === 'embedded'
    ? 'embedded'
    : 'standalone';
}
