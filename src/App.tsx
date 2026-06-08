import { useApp } from './context/AppContext'
import Logo from './components/Logo'
import CertCard from './components/CertCard'
import TransferBlock from './components/TransferBlock'
import Disclaimer from './components/Disclaimer'
import LoadingView from './components/LoadingView'
import DevPanel from './components/DevPanel'

export default function App() {
  const { state, isLoading } = useApp()

  return (
    <div data-state={state}>
      <div className="page">
        <Logo />
        {!isLoading && <CertCard />}
        {!isLoading && state !== 'invalid' && <TransferBlock />}
        {!isLoading && <Disclaimer />}
        {isLoading && <LoadingView />}
      </div>
      <DevPanel />
    </div>
  )
}
