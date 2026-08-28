import { Camera } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-8 h-8 text-purple-600" />
          <h1 className="text-xl font-bold text-gray-800">Event Memory Booth</h1>
        </div>
        <p className="text-sm text-gray-600 hidden sm:block">Create your event memories</p>
      </div>
    </header>
  )
}

export default Header
