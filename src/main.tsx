import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './store';
import App from './page'
import './assets/css/reset.scss'

const root = ReactDOM.createRoot(document.querySelector('#app')!)
root.render(
    <Provider store={store}>
        <ConfigProvider 
            // 语言
            locale={zhCN}
        >
            <BrowserRouter basename={process.env.NODE_ENV === 'development' ? '' : '/static-web-test'}>
                <App />
            </BrowserRouter>
        </ConfigProvider>
    </Provider>
)