/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI
 * TAG: LEEWAY.APP.UI.ENTRY.MAIN
 * WHAT: Browser entry point for the Office Suites client.
 * WHY: Mount the governed React application into the root document node.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/main.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Create the React root and load the governed stylesheet.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
