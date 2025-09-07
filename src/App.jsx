import { useState } from 'react'

import { Provider } from 'react-redux';     
import { store } from './redux/store';           

import Bank from './components/Bank';  

function App() {

  	return (
		<Provider store={store}>
			<Bank />
		</Provider>
 	)
}

export default App
