// Dharshini's portfolio content, taken from her resume and GitHub repos.
// Edit, then run:  npm run seed:real   (safe to re-run; empty fields are skipped)

module.exports = {
  about: {
    title: 'Dharshini K M - Software Product Engineering Student',
    description:
      'Motivated and detail-oriented Software Product Engineering student with hands-on experience in full-stack ' +
      'web development using the MERN stack. Passionate about building AI-powered applications, solving real-world ' +
      'problems, and continuously improving technical and leadership skills. Strong foundation in frontend and ' +
      'backend development with a keen interest in creating user-centric and impactful solutions.',
    image: '/uploads/profile.webp',
    social: {
      github: 'https://github.com/dharshinikalaiselvi1979-eng',
      linkedin: 'https://www.linkedin.com/in/dharshinimahendran81',
      twitter: '',
      email: 'dharshinikalaiselvi1979@gmail.com'
    }
  },

  projects: [
    {
      title: 'FIN AI - AI Powered Personal Finance Management System',
      description:
        'An AI-powered finance management application ("Smart Personal Finance"). Track budgets with daily, weekly and monthly limits, ' +
        'get smart spending alerts and weekly expense analytics, and sign in securely with JWT authentication or Google. ' +
        'The responsive UI works across all devices.',
      technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT'],
      link: 'https://github.com/dharshinikalaiselvi1979-eng/Fin-AI',
      image: '/uploads/finai.webp'
    },
    {
      title: 'CareerCompass AI',
      description:
        'A career guidance platform for students and professionals. Users take an 80-question assessment covering ' +
        'career interests (RIASEC / Holland Code), work values and behaviour tendencies. The app scores the answers, ' +
        'matches the user to careers from a library of 18 profiles, shows skill gaps, a personalised learning ' +
        'roadmap and recommended courses and projects, and includes a mentor chatbot for guidance. Includes ' +
        'user login with roles and an admin area for managing questions, viewing analytics and exporting data.',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Framer Motion', 'Recharts'],
      link: 'https://github.com/dharshinikalaiselvi1979-eng/CAREER-COMPASS-GUIDE',
      image: '/uploads/careercompass.webp'
    },
    {
      title: 'Text-to-Speech Web App',
      description:
        'A full-stack app that turns typed text into natural-sounding speech in 7 languages (English, Hindi, Gujarati, Marathi, Spanish, French and German) with neural male and female voices. ' +
        'The server translates the text first, so non-English voices speak genuine target-language audio, then ' +
        'generates the speech; users can play it in the browser or download it as MP3, and keep a speech history with favourites. Every generation is ' +
        'logged to Supabase. The API validates and sanitises input, restricts CORS, rate-limits requests and ' +
        'deletes generated audio after 10 minutes. Uses msedge-tts, which needs no paid account or API key.',
      technologies: ['React', 'Vite', 'Axios', 'Node.js', 'Express', 'Supabase', 'msedge-tts'],
      link: 'https://text-to-speech-client-sage.vercel.app',
      image: '/uploads/texttospeech.webp'
    },
    {
      title: 'StackDrive - Cloud Drive',
      description:
        'A cloud file storage app in the style of Google Drive. Upload files and whole folders, create folders, ' +
        'rename, star or delete items, and find files with search. Browse My Drive, Recent, Starred and Trash, ' +
        'switch between grid and list views, sort by newest, and track storage used against a 1 GB quota. ' +
        'Frontend and backend are separate repositories, and the app is deployed on Render.',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Render'],
      link: 'https://drive-frontend0000.onrender.com',
      image: '/uploads/stackdrive.webp'
    }
  ],

  skills: [
    { name: 'Python', level: 'Intermediate', category: 'Programming Languages' },
    { name: 'C++', level: 'Intermediate', category: 'Programming Languages' },
    { name: 'Java', level: 'Beginner', category: 'Programming Languages' },
    { name: 'JavaScript (ES6+)', category: 'Programming Languages' },
    { name: 'HTML5 & CSS3', category: 'Frontend' },
    { name: 'React.js', category: 'Frontend' },
    { name: 'Bootstrap', category: 'Frontend' },
    { name: 'Responsive Design', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'REST APIs', category: 'Backend' },
    { name: 'JWT Authentication', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Mongoose', category: 'Database' },
    { name: 'NoSQL', category: 'Database' },
    { name: 'Git', category: 'Tools' },
    { name: 'VS Code', category: 'Tools' },
    { name: 'Postman', category: 'Tools' },
    { name: 'Canva', category: 'Tools' },
    { name: 'Figma', category: 'Tools' }
  ],

  // Shown on the "Education & Leadership" page
  experience: [
    {
      company: 'Kalvium (Kalasalingam University), Coimbatore, Tamil Nadu',
      position: 'B.Tech in Software Product Engineering',
      description: 'Comprehensive program focused on end-to-end full-stack software development, data structures, algorithms, and product architecture.',
      start_date: '2025',
      end_date: '2029'
    },
    {
      company: 'KLAPS 2026',
      position: 'Co-Chair',
      description:
        'Took initiative in organizing and coordinating club events. Active participant in technical events and ' +
        'hackathons; collaborative team player who enjoys mentoring and helping peers.',
      start_date: '2025',
      end_date: '2026'
    }
  ],

  services: [
    {
      title: 'Full-Stack Web Development',
      description: 'Architecting and developing modern, responsive web applications from database schemas to interactive frontends using the MERN stack.',
      icon: '💻'
    },
    {
      title: 'AI & Machine Learning Solutions',
      description: 'Building custom AI applications, integrating speech-to-text / text-to-speech pipelines, recommendation engines, and mentor chatbots.',
      icon: '🤖'
    },
    {
      title: 'REST API & Cloud Engineering',
      description: 'Engineering secure, authenticated backend APIs with JWT, rate limiting, MongoDB data storage, and automated deployment pipelines.',
      icon: '⚡'
    }
  ],

  testimonials: [
    {
      author: 'Hackathon Collaborator',
      position: 'Fellow Engineering Peer',
      text: 'Dharshini brings outstanding energy and solid technical skills to full-stack projects. Her work on FIN AI and CareerCompass demonstrated real problem-solving ability and dedication.',
      image: ''
    },
    {
      author: 'KLAPS Team Member',
      position: 'Club Member',
      text: 'As Co-Chair at KLAPS, Dharshini was exceptional at leading technical initiatives, organizing hackathons, and mentoring junior team members.',
      image: ''
    }
  ]
};
