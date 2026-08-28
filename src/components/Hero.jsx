import { Sparkles } from 'lucide-react'

const Hero = () => {
  return (
    <section className="text-center py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <Sparkles className="w-16 h-16 text-purple-500" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Create Your Event Memory
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Upload your photo, remove the background, and place yourself in our event templates. 
          Download your personalized memory image in seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>AI Background Removal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Multiple Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Instant Download</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
