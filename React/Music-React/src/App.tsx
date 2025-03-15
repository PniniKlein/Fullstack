import './App.css'
import store from './store/store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
// import Header from './component/Header'
import { router } from './Router'
import api from './interceptor/axiosConfig'

function App() {
  return (
    <>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
    </>
  )
}

export default App
