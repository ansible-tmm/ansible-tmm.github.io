/**
 * Central project catalog for the Ansible TMM hub.
 * Add new entries here — no markup changes required.
 */
const PROJECTS = [
  {
    name: 'Slide Finder',
    description: 'Find reusable Ansible presentation slides and technical content for your next session.',
    category: 'Learn and Present',
    url: 'https://ansible.github.io/slides/',
    icon: 'slides',
    featured: false,
  },
  {
    name: 'Workshops and Labs',
    description: 'Launch hands-on workshops and guided lab environments for Ansible and Red Hat technologies.',
    category: 'Learn and Present',
    url: 'https://labs.demoredhat.com/',
    icon: 'lab',
    featured: true,
  },
  {
    name: 'Solution Guides',
    description: 'Explore practical, outcome-focused guides for solving infrastructure and IT automation challenges.',
    category: 'Learn and Present',
    url: 'https://ansible-tmm.github.io/solution-guides/',
    github: 'https://github.com/ansible-tmm/solution-guides',
    icon: 'guide',
    featured: true,
  },
  {
    name: 'Ansible Product Demos',
    description: 'Browse reusable demos that showcase Ansible Automation Platform capabilities and use cases.',
    category: 'Product Demos',
    url: 'https://ansible.github.io/product-demos/',
    icon: 'demo',
    featured: true,
  },
  {
    name: 'AAP Orchestrator Demos',
    description: 'Explore example workflows and demonstrations for automation orchestrator.',
    category: 'Product Demos',
    url: 'https://ansible-tmm.github.io/aap-orchestrator-demos/',
    github: 'https://github.com/ansible-tmm/aap-orchestrator-demos',
    icon: 'orchestrator',
    featured: false,
  },
  {
    name: 'Main Stage Demo Simulator',
    description: 'Step into an interactive simulator inspired by the Red Hat Summit 2026 main-stage demonstration environment.',
    category: 'Product Demos',
    url: 'https://ansible-tmm.github.io/rh-summit-2026/',
    icon: 'stage',
    featured: false,
  },
  {
    name: 'AAP CVE Report',
    description: 'Review and explore CVE information relevant to Ansible Automation Platform.',
    category: 'Tools and Utilities',
    url: 'https://ansible-tmm.github.io/aap_cve_report/',
    icon: 'security',
    featured: false,
  },
  {
    name: 'Ansible F1',
    description: "Put automation in the driver's seat in this Ansible-themed racing game.",
    category: 'Games and Interactive Experiences',
    url: 'https://ansible-tmm.github.io/ansible-f1/',
    icon: 'racing',
    featured: false,
  },
  {
    name: 'Ansible Quest',
    description: 'Learn and explore Ansible concepts through an interactive adventure game.',
    category: 'Games and Interactive Experiences',
    url: 'https://ansible-tmm.github.io/ansible-quest/',
    icon: 'quest',
    featured: false,
  },
];

/** Category display order and anchor IDs for navigation */
const CATEGORIES = [
  { name: 'Learn and Present', id: 'learn-and-present' },
  { name: 'Product Demos', id: 'product-demos' },
  { name: 'Tools and Utilities', id: 'tools-and-utilities' },
  { name: 'Games and Interactive Experiences', id: 'games' },
];
