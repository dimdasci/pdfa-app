import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { AuthGuard } from './components/auth/AuthGuard';

// Placeholder components - these would be in separate files in a real app
function Dashboard() {
  const intl = useIntl();
  
  // Mock document list
  const documents = [
    { id: '1', name: 'Example PDF 1' },
    { id: '2', name: 'Example PDF 2' },
    { id: '3', name: 'Example PDF 3' },
  ];
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <FormattedMessage id="app.dashboard" defaultMessage="Dashboard" />
      </h1>
      <p className="mb-4">
        <FormattedMessage 
          id="app.authenticated" 
          defaultMessage="You are authenticated! This is a protected page." 
        />
      </p>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">
          <FormattedMessage id="app.documents" defaultMessage="Your Documents" />
        </h2>
        
        <ul className="space-y-2">
          {documents.map(doc => (
            <li key={doc.id} className="border border-gray-200 p-3 rounded hover:bg-gray-50">
              <Link to={`/documents/${doc.id}`} className="text-blue-600 hover:underline">
                {doc.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DocumentView() {
  const intl = useIntl();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <FormattedMessage id="app.document_view" defaultMessage="Document View" />
      </h1>
      <p className="mb-4">
        <FormattedMessage 
          id="app.document_placeholder" 
          defaultMessage="Document viewing functionality will be implemented here." 
        />
      </p>
      
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          <FormattedMessage id="app.back_to_dashboard" defaultMessage="← Back to Dashboard" />
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/documents/:documentId" 
          element={
            <AuthGuard>
              <DocumentView />
            </AuthGuard>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
