export const profile = {
  name: 'Imran Pathan', fullName: 'Pathan Imran Sadik',
  email: 'afridkhan9371@gmail.com', phone: '+91 99601 23250', phoneLink: '+919960123250',
  github: 'https://github.com/imran5152', location: 'Vaijapur, Maharashtra, India',
  education: 'Bachelor of Computer Applications', college: 'Vinayakrao Patil Mahavidyalaya, Vaijapur', university: 'Dr. Babasaheb Ambedkar Marathwada University',
};
export const projects = [
  { id: 'shopwave', number: '01', name: 'ShopWave', category: 'Web development', type: 'E-commerce experience', cover: 'shopwave',
    summary: 'A considered shopping experience, from the first search to the final cart.',
    description: 'A responsive React storefront with product discovery, category filters, product details and a persistent shopping cart.',
    role: 'Academic project · React frontend',
    highlights: ['Product search, category filtering and sorting', 'Context API cart with real-time quantity management', 'localStorage persistence and client-side routing', 'Deployed on Render with a GitHub workflow'],
    tags: ['React', 'Vite', 'Context API', 'CSS'], source: 'https://github.com/imran5152/react_front1', demo: 'https://react-front1-3.onrender.com/', image: '/images/shopwave.jpg',
  },
  { id: 'kubernetes', number: '02', name: 'Code. Container. Cloud.', category: 'DevOps', type: 'Three-tier Kubernetes deployment', cover: 'cloud',
    summary: 'Connecting a React frontend, Java backend and database on Kubernetes.',
    description: 'A hands-on deployment project for a three-tier college application, bringing a React frontend, Java backend and database together with Docker and Kubernetes.',
    role: 'Hands-on DevOps project',
    highlights: ['Containerised application components with Docker', 'Kubernetes manifests in a dedicated k8s/ directory', 'Separate frontend and backend deployment configuration', 'Version-controlled configuration and incremental updates'],
    tags: ['Docker', 'Kubernetes', 'Java', 'React'], source: 'https://github.com/imran5152/Java-React-k8s',
  },
  { id: 'netflix', number: '03', name: 'Netflix-inspired streaming', category: 'Web development', type: 'Streaming interface & authentication', cover: 'streaming',
    summary: 'A cinematic interface with movie discovery and Firebase authentication.',
    description: 'A Netflix-inspired academic project with responsive movie cards, hover previews, login and registration, and Firebase-backed user data.',
    role: 'Academic web development project',
    highlights: ['Responsive movie and show cards', 'Teaser previews on hover', 'Login and registration with Firebase Authentication', 'User data stored using Firebase Firestore'],
    tags: ['JavaScript', 'CSS', 'Firebase'], source: 'https://github.com/imran5152/Netflix-clone',
  },
  { id: 'resume', number: '04', name: 'A better first impression.', category: 'Web development', type: 'MERN resume builder', cover: 'resume',
    summary: 'A resume-building application with a responsive UI and REST APIs.',
    description: 'An academic MERN application for building resumes, with a React and Tailwind interface, Express REST APIs, and MongoDB storage.',
    role: 'Academic project · Full stack',
    highlights: ['Responsive React and Tailwind CSS interface', 'REST APIs built with Node.js and Express', 'Persistent data storage using MongoDB', 'Resume-building workflow across frontend and backend'],
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
  },
];
export const moreProjects = [
  { name: 'Car showroom', detail: 'Responsive frontend · forms & file validation', url: 'https://github.com/Kaveri-tech/Car-UI' },
  { name: 'YouTube-inspired interface', detail: 'Video UI · sidebar, navigation & APIs', url: 'https://github.com/Kaveri-tech/Youtube-clone' },
  { name: 'Gym management system', detail: 'Group project · PHP CRUD & MySQL' },
];
export const skills = [
  { title: 'The interface', subtitle: 'Where ideas become experiences.', items: ['React', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'Bootstrap', 'Material UI'], icon: 'layout' },
  { title: 'The engine', subtitle: 'The logic behind the experience.', items: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'PHP', 'Python'], icon: 'code' },
  { title: 'The delivery', subtitle: 'From the repository to a running app.', items: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'Linux', 'Git & GitHub', 'Maven', 'SonarQube', 'Nexus', 'Tomcat'], icon: 'cloud' },
];
export const services = [
  { number: '01', title: 'Websites with a purpose.', description: 'A personal portfolio, a business presence or a landing page that looks right and works on every screen.', tags: ['Business websites', 'Portfolios', 'Landing pages'], icon: 'layout' },
  { number: '02', title: 'More than a pretty screen.', description: 'React interfaces connected to practical backend APIs and a database, built around what your project needs.', tags: ['React applications', 'REST APIs', 'MongoDB'], icon: 'code' },
  { number: '03', title: 'Help getting it out there.', description: 'Project setup, containerisation and deployment assistance, with clear handover notes so you can keep moving.', tags: ['Docker setup', 'Deployment help', 'Project handover'], icon: 'cloud' },
];
export function contactLink(intent, values = {}) {
  const subject = intent === 'hire' ? 'An opportunity for Imran' : 'A project for Imran';
  const lines = [
    `Hi Imran,`, '', intent === 'hire' ? "I'd like to discuss a role or internship." : "I'd like to discuss a project.",
    '', `Name: ${values.name || ''}`, `Email: ${values.email || ''}`, '', values.message || '',
  ];
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
