import './App.css'
import store from './store/store'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Header from './component/Header'

function App() {
  return (
    <>
    <Provider store={store}>
      <Header/>
      <Outlet/>
    </Provider>
    </>
  )
}

export default App
