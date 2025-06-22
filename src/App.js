import './css/App.css';
import AppRouter from './components/router';
import { ConfigProvider, theme, App as AntdApp } from 'antd';

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
      <AntdApp>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App;