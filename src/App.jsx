import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/auth/AuthGuard';
import MainLayout from './components/layout/MainLayout';
import DashboardContainer from './components/dashboard/DashboardContainer';
import ProcessingContainer from './components/processing/ProcessingContainer';
import AnalysisContainer from './components/analysis/AnalysisContainer';

// Upload Modal component - will be implemented as a route
const UploadModal = () => (
  <div className="flex items-center justify-center h-full">
    <div className="bg-white rounded-lg shadow p-8">
      <p>Upload modal will be implemented here</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard route */}
        <Route 
          path="/" 
          element={
            <AuthGuard>
              <MainLayout>
                <DashboardContainer />
              </MainLayout>
            </AuthGuard>
          } 
        />
        
        {/* Upload modal route */}
        <Route 
          path="/upload" 
          element={
            <AuthGuard>
              <MainLayout>
                <UploadModal />
              </MainLayout>
            </AuthGuard>
          } 
        />
        
        {/* Processing view route */}
        <Route 
          path="/documents/:documentId/processing" 
          element={
            <AuthGuard>
              <MainLayout>
                <ProcessingContainer />
              </MainLayout>
            </AuthGuard>
          } 
        />
        
        {/* Analysis view route */}
        <Route 
          path="/documents/:documentId/analysis" 
          element={
            <AuthGuard>
              <MainLayout>
                <AnalysisContainer />
              </MainLayout>
            </AuthGuard>
          } 
        />
        
        {/* Redirect /documents/:documentId to the analysis view */}
        <Route 
          path="/documents/:documentId" 
          element={<Navigate to="/documents/:documentId/analysis" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
