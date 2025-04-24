import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useApi';
import DashboardHeader from './DashboardHeader';
import DocumentTable from './DocumentTable';
import EmptyState from './EmptyState';
import UploadModal from './UploadModal'; // Import the new component

const DashboardContainer = () => {
  const intl = useIntl();
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch documents from API - without status filter
  const { documents, loading, error, refetch } = useDocuments();
  
  // Placeholder for upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Filter documents based on search term and status
  const filteredDocuments = documents ? documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }) : [];
  
  // Calculate file size in human-readable format
  const getHumanFileSize = (pageCount, status) => {
    // Only completed documents have page count
    if (status.toLowerCase() !== 'complete' || pageCount === undefined) {
      return 'N/A';
    }
    
    // This is a placeholder since API doesn't return file size
    // We're estimating based on page count (rough approximation)
    const estimatedSize = pageCount * 0.2; // Assume 200KB per page on average
    return estimatedSize > 1 ? `${estimatedSize.toFixed(1)} MB` : `${(estimatedSize * 1000).toFixed(0)} KB`;
  };

  // Format date to local date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get appropriate status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex flex-col p-4 md:p-6 overflow-auto h-full">
      {/* Document List Section */}
      <section>
        <DashboardHeader 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onFilterChange={(e) => setStatusFilter(e.target.value)}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
        
        {/* Use the new DocumentTable component */}
        <DocumentTable 
          loading={loading}
          error={error}
          filteredDocuments={filteredDocuments}
          formatDate={formatDate}
          getHumanFileSize={getHumanFileSize}
          getStatusBadgeClass={getStatusBadgeClass}
        />
        
        {/* Render Empty State conditionally */}
        {!loading && !error && documents && documents.length === 0 && (
          <EmptyState onUploadClick={() => setIsUploadModalOpen(true)} />
        )}
      </section>
      
      {/* Render the Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={refetch}
      />
    </div>
  );
};

export default DashboardContainer; 