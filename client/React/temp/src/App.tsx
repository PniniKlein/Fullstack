// import './App.css'
import store from './store/store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { router } from './Router'



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
