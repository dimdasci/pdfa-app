import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '../../hooks/useApi';
import DashboardHeader from './DashboardHeader';
import DocumentTable from './DocumentTable';
import EmptyState from './EmptyState';
import UploadModal from './UploadModal'; // Import the new component

const DashboardContainer = () => {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get initial values from URL search params or use defaults
  const initialSearchTerm = searchParams.get('search') || '';
  const initialStatusFilter = searchParams.get('status') || 'all';
  const initialSortField = searchParams.get('sortField') || 'uploaded';
  const initialSortDirection = searchParams.get('sortDir') || 'desc';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  
  // State for sorting
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage] = useState(10);
  
  // Fetch documents from API - without status filter
  const { documents, loading, error, refetch } = useDocuments();
  
  // Placeholder for upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Filter documents based on search term and status
  const filteredDocuments = documents ? documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Handle sorting based on the selected field and direction
    if (sortField === 'name') {
      // Case insensitive string comparison for names
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    } else if (sortField === 'uploaded') {
      // Date comparison for uploaded field
      const dateA = new Date(a.uploaded);
      const dateB = new Date(b.uploaded);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  }) : [];
  
  // Convert bytes to human-readable file size
  const getHumanFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) {
      return 'N/A';
    }
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Format date to local date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get appropriate status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Update URL parameters when filters or sort options change
  const updateURLParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Update specified params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Update the URL without reloading the page
    setSearchParams(newParams);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to page 1 when search changes
    setCurrentPage(1);
    updateURLParams({ 
      search: value || null,
      page: '1' // Reset page when search changes
    });
  };

  // Handle status filter change
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    updateURLParams({ 
      status: value === 'all' ? null : value,
      page: '1' // Reset page when filter changes
    });
  };

  // Handle sort column click
  const handleSortChange = (field) => {
    let newDirection;
    
    // If clicking the same field, toggle direction
    if (field === sortField) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      // If clicking a new field, set it as the sort field with default descending for date, ascending for name
      newDirection = field === 'uploaded' ? 'desc' : 'asc';
      setSortField(field);
      setSortDirection(newDirection);
    }
    
    // Reset to page 1 when sort changes
    setCurrentPage(1);
    
    // Update URL parameters
    updateURLParams({ 
      sortField: field, 
      sortDir: newDirection,
      page: '1' // Reset page when sort changes
    });
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURLParams({ page: newPage.toString() });
  };
  
  return (
    <div className="flex flex-col p-4 md:p-6 overflow-auto h-full">
      {/* Document List Section */}
      <section>
        <DashboardHeader 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
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
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredDocuments.length}
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