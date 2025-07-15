import './css/App.css';
import AppRouter from './components/router';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import { ProfileProvider } from './components/context/profilecontext';
import { NotificationProvider } from './components/context/notificationcontext';

function App() {
  const themeToken = {
    colorPrimary: "#00c593",
    colorInfo: "#00c593"
  }
  return (
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
      token: themeToken
    }}>
      <ProfileProvider>
        <NotificationProvider>
          <AntdApp>
            <AppRouter />
          </AntdApp>
        </NotificationProvider>
      </ProfileProvider>
    </ConfigProvider>
  )
}

export default App;