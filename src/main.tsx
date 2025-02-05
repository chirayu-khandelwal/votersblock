
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove StrictMode from App.tsx and place it here
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
