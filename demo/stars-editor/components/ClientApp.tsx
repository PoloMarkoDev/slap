import React from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { EditorPage } from './pages/editor/EditorPage';
import { AboutPage } from './pages/AboutPage';
import { WindowService } from '../services/window.service';
import { useModule } from '../../../lib';
import { HighloadPage } from './pages/HighloadPage';
import { UsersPage } from './pages/UsersPage';
import { WatchersPage } from './pages/WatchersPage';
import { QueriesPage } from './pages/QueriesPage';
import { ExtendedStatePage } from './pages/ExtendedState';
import { MutationsPage } from './pages/MutationDecorator';
import { FormBindingsPage } from './pages/FormBindingsPage';
import { FunctionalModulesPage } from './pages/FunctionalModules';
import { ShouldComponentUpdatePage } from './pages/ShouldComponentUpdate';

export function ClientApp() {
  const { isLoading, activePage } = useModule(WindowService);

  if (isLoading) return <div>App loading...</div>;

  return (
    <Layout style={{ height: '100%' }}>
      <Header />
      {activePage === 'editor' && <EditorPage /> }
      {activePage === 'about' && <AboutPage /> }
      {activePage === 'highload' && <HighloadPage /> }
      {activePage === 'users' && <UsersPage /> }
      {activePage === 'watchers' && <WatchersPage /> }
      {activePage === 'queries' && <QueriesPage /> }
      {activePage === 'extended' && <ExtendedStatePage /> }
      {activePage === 'mutation' && <MutationsPage /> }
      {activePage === 'form-bindings' && <FormBindingsPage /> }
      {activePage === 'functional-modules' && <FunctionalModulesPage /> }
      {activePage === 'should-update' && <ShouldComponentUpdatePage /> }
    </Layout>
  );
}
