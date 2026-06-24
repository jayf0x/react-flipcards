import type { GlobalProvider } from '@ladle/react';
import './global.css';

// Wraps every story with consistent padding + font.
export const Provider: GlobalProvider = ({ children }) => <div className='demo-root'>{children}</div>;
