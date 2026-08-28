// Template data for the event memory booth

export const templates = [
  {
    id: 'template-01',
    name: 'Classic',
    background: '/assets/templates/template-01.png',
    frame: '/assets/frames/frame-01.png',
    eventTitle: 'Innovative Project Exhibition',
    defaultPosition: { x: 0.5, y: 0.55 },
    defaultScale: 1,
    aspectRatio: 4/3
  },
  {
    id: 'template-02',
    name: 'Modern',
    background: '/assets/templates/template-02.png',
    frame: '/assets/frames/frame-02.png',
    eventTitle: 'Tech Summit 2024',
    defaultPosition: { x: 0.5, y: 0.6 },
    defaultScale: 0.9,
    aspectRatio: 16/9
  },
  {
    id: 'template-03',
    name: 'Creative',
    background: '/assets/templates/template-03.png',
    frame: null,
    eventTitle: 'Design Workshop',
    defaultPosition: { x: 0.5, y: 0.5 },
    defaultScale: 1.1,
    aspectRatio: 1/1
  }
]
