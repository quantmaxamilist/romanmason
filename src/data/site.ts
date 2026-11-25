// All copy in this file is VERBATIM from the live site https://www.romanmasonconstruction.co.uk
// (fetched 25 Nov 2026). Nothing here is invented. Neutral UI microcopy lives in the components.

export const site = {
  name: 'Roman Mason Construction',
  url: 'https://www.romanmasonconstruction.co.uk',
  phone: '07932 259704',
  phoneHref: 'tel:+447932259704',
  email: 'romanmasonconstructionltd@outlook.com',
  location: 'Cheshire, North West',
  year: '2021', // the year shown in the pediment of the logo
  social: {
    facebook: 'https://www.facebook.com/people/RomanMason-Construction/100078399207437/',
    instagram: 'https://www.instagram.com/romanmasonconstruction/',
  },
  copyright: 'Copyright ©2026 Roman Mason Construction',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// Exact <title> and meta description of every old page.
export const seo = {
  home: {
    title: 'Building Contractors in Cheshire - Roman Mason Construction',
    description: 'Roman Mason Construction are your Trusted Commercial Building Contractors in Cheshire North West.',
  },
  about: {
    title: 'About - Roman Mason Construction - Cheshire, North West',
    description: 'Roman Mason Construction was built on strong family values and decades of experience in the construction industry. Read more.',
  },
  services: {
    title: 'Construction Solutions for Projects Across Cheshire - Roman Mason Construction',
    description: 'Roman mason Construction offer Construction Solutions for Projects Across Cheshire. Find out more about our range of services.',
  },
  gallery: {
    title: 'Gallery - Roman Mason Construction - Cheshire, North West',
    description: 'View Our Gallery',
  },
  contact: {
    title: "Contact - Roman Mason Construction - Cheshire's Trusted Building Contractors",
    description: "Get in touch and find out how Cheshire's Trusted Building Contractors can help you with your next project.",
  },
  blog: {
    title: 'Blog - Roman Mason Construction - Cheshire, North West',
    description: '',
  },
  privacy: { title: 'Privacy Policy - Roman Mason Construction - Cheshire, North West', description: '' },
  cookie: { title: 'Cookie Policy - Roman Mason Construction - Cheshire, North West', description: '' },
};

export const home = {
  hero: {
    eyebrow: 'Roman Mason Construction',
    h1: 'Trusted Commercial Building Contractors in Cheshire North West',
    lead: 'Specialists in both internal and external construction projects, ensuring quality and customer satisfaction in every project we undertake.',
    cta: 'Get In Touch',
  },
  who: {
    eyebrow: 'Who Are We',
    h2: "Building Expertise for Cheshire's Commercial Sector",
    body: 'Welcome to Roman Mason Construction, where we combine years of experience with a commitment to excellence. Specialising in multi-floor projects and extensions across Cheshire, we have built a reputation as a reliable construction company. Our dedication to quality and customer satisfaction has made us a trusted name in the industry.',
    cta: 'Read More',
  },
  services: {
    eyebrow: 'Our Services',
    h2: 'Tailored Solutions for Your Construction Needs',
    cta: 'All Services',
  },
  cta: {
    eyebrow: 'Get In Touch',
    h2: 'Start Your Next Project with Roman Mason Construction',
    body: 'Ready to bring your construction project to life? Whether you’re planning a new build, renovation, or extension, Roman Mason Construction is here to help. Contact us today to discuss your project and receive a free quote.',
    cta: 'Contact Us',
  },
  why: {
    eyebrow: 'Why Choose Us',
    h2: 'Why Choose Roman Mason Construction For Your Building Needs',
    points: [
      {
        title: 'Family-Run Business',
        body: 'As a family-run construction business in Cheshire, we infuse our work with the values of integrity, dedication, and a personal touch, ensuring that every project reflects our commitment to excellence.',
      },
      {
        title: 'An Expert Team You Can Trust',
        body: 'Our team of skilled professionals brings a wealth of experience to every project, ensuring that we deliver exceptional results, no matter the size or complexity of the task.',
      },
      {
        title: 'Customer-Centric Approach',
        body: 'We prioritise your vision and needs, working closely with you at every stage to ensure that the final outcome aligns perfectly with your expectations.',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Testimonials',
    h2: 'What Our Clients Say About Our Construction Services',
    // Quotes are reproduced exactly as published, including the customers' own spelling.
    items: [
      {
        quote: 'Ian and his team work with us on many of our clients building projects. always professional and quality of workmanship. would always recomend to any of our clients',
        name: 'AF Architectural Designs',
      },
      {
        quote: 'We are so pleased with our new home a 19th Century cottage brilliantly renovated by Ian and his team. Great work and a pleasure to work with always, very polite and tidy with some great humour thrown in. We would definitely use them again, Jonathan & Lucy',
        name: 'Jonathan Cowdell',
      },
      {
        quote: "We have been so pleased with everything Ian and his team has done, great lads and very courteous. everything has gone so smoothly, couldn't recommend them highly enough. All done to a high standard and nothing is too much trouble for them. We would definitely use them again",
        name: 'Dan Evans',
      },
      {
        quote: 'Ian and his team are excellent. The speed of their work, the reliability ( they don’t disappear for days ) and the competence prices makes this company one that I would highly recommend to others looking for renovations , extensions or new builds.',
        name: 'Fiona Mcclements',
      },
      {
        quote: 'Ian and the team are great at what they do! I’d 100% recommend them to anyone! For all types of construction work, extensions & full renovations! They’re the best about 👌🏻',
        name: 'Bobby Pallett',
      },
    ],
  },
};

// The five services. `body` is the Services-page wording; `homeBody` is set only where the homepage
// wording differs (Project Management says "Our commercial project management services…" there).
export const services = [
  {
    slug: 'project-management',
    numeral: 'I',
    name: 'Project Management',
    body: 'Our project management services cover every aspect of your construction project, from initial planning to final execution. We work closely with clients to ensure projects are completed on time and within budget, while meeting your specific business needs.',
    homeBody: 'Our commercial project management services cover every aspect of your construction project, from initial planning to final execution. We work closely with clients to ensure projects are completed on time and within budget, while meeting your specific business needs.',
    post: '2026/03/06/project-management-cheshire',
    part: 'emblem',
  },
  {
    slug: 'multi-floor-construction',
    numeral: 'II',
    name: 'Internal & External Multi-Floor Construction',
    body: 'We are experts in multi-floor construction, providing comprehensive services for both internal and external projects. We ensure your building is both durable and visually appealing, meeting the demands of modern spaces.',
    post: '2026/01/29/multi-floor-construction-cheshire',
    part: 'columns',
    photo: 'feat-joists',
  },
  {
    slug: 'extensions',
    numeral: 'III',
    name: 'Extensions',
    body: 'Specialising in extensions, our team designs and constructs additional spaces that integrate seamlessly with your existing structure. We focus on maximising both functionality and aesthetic coherence, enhancing the value and usability of your property.',
    post: '2026/02/06/extensions-in-cheshire',
    part: 'steps',
    photo: 'work-21',
  },
  {
    slug: 'spray-rendering',
    numeral: 'IV',
    name: 'Spray Rendering',
    body: 'Our spray rendering services offer a high-quality finish for your building’s exterior, providing both enhanced aesthetics and increased durability. Ideal for both new constructions and refurbishments, spray rendering ensures a smooth, even finish that stands the test of time.',
    post: '2026/02/13/spray-rendering-cheshire',
    part: 'finish',
    photo: 'feat-render',
  },
  {
    slug: 'refurbishment',
    numeral: 'V',
    name: 'Refurbishment',
    body: 'Revitalise your property with our refurbishment services. Whether you’re updating an outdated space or restoring a building to its former glory, we provide tailored solutions that blend modern standards with respect for the original structure, delivering results that breathe new life into your property.',
    post: '',
    part: 'top',
    photo: 'feat-kitchen',
  },
];

export const servicesPage = {
  eyebrow: 'Our Services',
  h1: 'Construction Solutions for Projects Across Cheshire',
  lead: 'At Roman Mason Construction, we offer a wide range of construction services throughout Cheshire and beyond. From project management and multi-floor builds to refurbishments and spray rendering, our team is committed to excellence in every project.',
  industries: {
    eyebrow: 'Industries We Serve',
    h2: 'Commercial and Domestic Construction',
    intro: 'At Roman Mason Construction, we provide high-quality construction services for both commercial and domestic clients across Cheshire. Our expertise spans a variety of sectors, ensuring tailored solutions that meet the specific demands of each industry.',
    sectors: [
      { name: 'Retail', body: 'Designing and building retail spaces that balance customer experience with operational efficiency.' },
      { name: 'Office Spaces', body: 'Modernising and expanding office environments to create functional, contemporary workspaces.' },
      { name: 'Hospitality', body: 'Crafting inviting and efficient spaces for hotels, restaurants, and other hospitality venues.' },
    ],
    domestic: 'Alongside our commercial services, we also specialise in domestic construction, offering high-quality builds, renovations, and extensions for residential properties. Whether it’s expanding your home with a new extension or refurbishing your existing space, Roman Mason Construction ensures each project is handled with the same attention to detail and craftsmanship as our commercial work.',
  },
};

export const about = {
  eyebrow: 'Who Are We',
  h1: 'About Roman Mason Construction',
  // Split at sentence boundaries only; the three sentences are the old page's opening paragraph.
  lead: [
    'Roman Mason Construction was built on strong family values and decades of experience in the construction industry.',
    'Named after two sons, the business reflects a commitment to trust, communication, and delivering perfection in every project.',
    'Based in Cheshire, this family-run construction company has developed a reputation for exceeding expectations, offering high-quality services for projects across the region.',
  ],
  different: {
    eyebrow: 'Why We Stand Out',
    h2: 'What Makes Roman Mason Construction Different?',
    points: [
      {
        title: 'Family Values at the Core',
        body: 'As a family-run business, Roman Mason Construction takes pride in maintaining the values of honesty, integrity, and dedication in every project. Relationships with clients are built on trust and mutual respect, ensuring every project is delivered with a personal touch.',
      },
      {
        title: 'Over 30 Years of Industry Expertise',
        body: 'With extensive experience in the construction industry, Roman Mason Construction provides a wealth of knowledge across various trades. From plastering to complex commercial builds, the team applies its vast expertise to ensure seamless project delivery and superior outcomes.',
      },
      {
        title: 'Commitment to Perfection',
        body: 'Every project taken on by Roman Mason Construction is approached with a commitment to exceeding client expectations. From multi-floor construction to extensions and refurbishments, the team is dedicated to ensuring every detail is completed to the highest standard, delivering results that are both functional and visually stunning.',
      },
    ],
  },
  journey: {
    eyebrow: 'Our Journey',
    h2: 'From Plastering to Complete Construction Solutions',
    body: 'With over 30 years of hands-on experience, the founder of Roman Mason Construction began as a plasterer before progressing into the wider building industry. This solid foundation and attention to detail have helped shape the company into one of Cheshire’s most trusted building contractors. Every project, regardless of size, is overseen with a meticulous eye, ensuring that only the highest standards are achieved.',
  },
};

export const gallery = {
  eyebrow: 'View Our Gallery',
  h1: 'Quality Construction Projects Across Cheshire',
  lead: 'At Roman Mason Construction, we pride ourselves on delivering high-quality construction projects that stand the test of time. Our attention to detail, commitment to craftsmanship, and use of premium materials are evident in every project we complete.',
};

export const contact = {
  eyebrow: 'Contact Us',
  h1: "Get in Touch with Cheshire's Trusted Building Contractors",
  lead: 'We’re here to help bring your construction projects to life. Whether you have a question about our services, want to discuss your next project, or need a quote, the team at Roman Mason Construction is ready to assist you.',
  labels: { phone: 'Phone Number', email: 'Email Address', location: 'Location' },
  form: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone Number',
    message: 'Message',
    gdpr: 'This form collects personal information such as your name and email, together with the other data fields so we can later communicate with you appropriately. By submitting this form, you agree to our',
    send: 'Send',
  },
};
