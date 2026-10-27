import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TeamPage from './TeamPage';

const isTeamPage = window.location.pathname.replace(/\/$/, '') === `${process.env.PUBLIC_URL}/team`;
const page = isTeamPage ? <TeamPage /> : <App />;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {page}
  </React.StrictMode>
);
