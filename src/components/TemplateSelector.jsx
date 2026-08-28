import { templates } from '../data/templates'

const TemplateSelector = ({ selectedTemplate, onTemplateSelect }) => {
  const bgColors = {
    'template-01': 'bg-purple-100',
    'template-02': 'bg-blue-100', 
    'template-03': 'bg-green-100'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
              ${selectedTemplate?.id === template.id
                ? 'border-purple-500 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-purple-300'}`}
          >
            <div className={`absolute inset-0 ${bgColors[template.id] || 'bg-gray-100'} flex items-center justify-center`}>
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-700">{template.name.charAt(0)}</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
              <p className="text-white text-xs font-medium truncate">{template.name}</p>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        Select a template to place your photo
      </p>
    </div>
  )
}

export default TemplateSelector
