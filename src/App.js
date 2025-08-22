import './App.css';
import Lanyard from './components/Lanyard';
import Terminal from './components/Terminal';

function App() {
  return (
    <>
    <div className='main h-screen flex flex-col justify-between'>
      <header className="p-4 border-b border-green-700 text-center md:text-left">
        <h1 className='text-green-500 font-bold text-2xl'>Maitri Suthar</h1>
        <p className='text-gray-400 text-sm'>Software Devloper</p>  
      </header>
      <div className='flex flex-row flex-1 overflow-hidden'>
        <div className='w-3/5 border-r border-green-700 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_40%)]'>
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </div>
        <div className='p-4 w-full'>
          <Terminal />
        </div>
      </div>
      <footer className="p-4 border-t border-green-700 text-center md:text-left text-xs text-green-500 flex justify-between">
        <span>maitri@portfolio:~$</span>
      </footer>
      </div>
    </>
  );
}

export default App;
