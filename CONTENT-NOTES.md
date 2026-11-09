# Content and implementation notes

## Supplied requirements

Final expense insurance pay-per-call microsite; phone (833) 307-1006; video G5zC19ZbSII; separate privacy policy; GitHub destination darryldelongmarketing/finalexpenseinsuranceforyou. Add the user-supplied Meta Pixel 2151654019078665 with PageView tracking to every page.

The descriptive brand is Final Expense For You. Specific prices, carrier relationships, geographic coverage, eligibility guarantees, representative licenses, opening hours, and recording practices were not supplied and have not been invented.

## Sources

- Washington insurance regulator, Funeral insurance: https://www.insurance.wa.gov/insurance-resources/life-insurance/funeral-insurance
- NAIC, Life Insurance: https://content.naic.org/consumer/life-insurance.htm
- YouTube embedding: https://support.google.com/youtube/answer/171780
- Google Privacy Policy: https://policies.google.com/privacy
- Meta privacy and cookie policy links: https://www.facebook.com/privacy/policy/ and https://www.facebook.com/policies/cookies/
- Netlify build configuration: https://docs.netlify.com/build/configure-builds/file-based-configuration/
- Netlify environment variables: https://docs.netlify.com/build/configure-builds/environment-variables/

## Behavior

No forms, payments, or site-maintained visitor database. Meta Pixel 2151654019078665 initializes and queues PageView on each home, privacy-policy, and 404 page load, with a matching noscript fallback. The privacy policy discloses Meta tracking. The content security policy permits the required Meta script and event origins while retaining restrictions on inline code. No telephone conversion events are configured in the website code.

Locally served illustrative AI-generated photo, system fonts, click-to-load privacy-enhanced YouTube player, direct YouTube fallback, accessible native FAQs, skip link, keyboard focus, reduced-motion support, and mobile call bar. Default review build is noindex; public Netlify build enables indexing.

## Verification

Desktop visual review and mobile layouts at 390 px and 320 px. Both pages render with consistent branding and call links. FAQ expansion and video open/close controls checked. The embed loaded the requested title, uploader Darryl DeLong, and 59-second duration; end-to-end media streaming was not confirmed in the cloud test browser. No live telephone call was placed.

Meta Pixel update: the static build and whitespace checks passed. All three generated pages were checked for one shared head loader and one matching body noscript image. An isolated JavaScript smoke check verified the exact pixel ID, one queued PageView, asynchronous Meta library loading, and behavior when fbq already exists. Required CSP origins and fallback styling were checked. No test events were sent to Meta, and receipt in Meta Events Manager has not been verified.

## Owner details to complete

Add the actual legal website operator and dedicated privacy contact to the privacy policy. Confirm offer-specific disclosures and call handling with the receiving agency/provider. Update the policy when analytics, advertising tags, tracking, forms, or other data processing changes.
