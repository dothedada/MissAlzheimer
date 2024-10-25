import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/styles.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div>123</div>
    </StrictMode>,
);
