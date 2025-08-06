import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const HOC = (WrappedComponent) => {
  const DashboardLayoutComponent = (props) => {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <div className="flex">
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={setSidebarCollapsed}
          />
          <main 
            className={`flex-1 transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'ml-16' : 'ml-64'
            } pt-16`}
          >
            <div className="p-6">
              <WrappedComponent 
                {...props} 
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
              />
            </div>
          </main>
        </div>
      </div>
    );
  };

  DashboardLayoutComponent.displayName = `withDashboardLayout(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return DashboardLayoutComponent;
};

export default HOC;
