
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from '../../components/Header';
import { DashboardIcon, AnalyticsIcon, KnowledgeBaseIcon, SettingsIcon } from '../../components/icons/SidebarIcons';

const AdminLayout: React.FC = () => {
    const navLinkClasses = ({ isActive }: {isActive: boolean}) => 
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive 
            ? 'bg-light-accent dark:bg-dark-accent text-white' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`;

    return (
        <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
                <div className="p-4 border-b border-light-border dark:border-dark-border">
                    <h2 className="text-lg font-bold">Admin Panel</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <NavLink to="/admin/dashboard" className={navLinkClasses}>
                        <DashboardIcon className="h-5 w-5 mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/analytics" className={navLinkClasses}>
                        <AnalyticsIcon className="h-5 w-5 mr-3" />
                        Analytics
                    </NavLink>
                    <NavLink to="/admin/knowledge-base" className={navLinkClasses}>
                        <KnowledgeBaseIcon className="h-5 w-5 mr-3" />
                        Knowledge Base
                    </NavLink>
                    <NavLink to="/admin/settings" className={navLinkClasses}>
                        <SettingsIcon className="h-5 w-5 mr-3" />
                        Settings
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header isAdmin={true} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
