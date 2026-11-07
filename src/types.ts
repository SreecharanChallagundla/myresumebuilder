export interface Basics {
  name: string; title: string; email: string; phone: string
  location: string; link: string; summary: string
}
export interface Experience { id: string; company: string; role: string; start: string; end: string; bullets: string }
export interface Education { id: string; school: string; degree: string; start: string; end: string }
export interface SkillGroup { id: string; label: string; items: string }

export interface Resume {
  basics: Basics
  experience: Experience[]
  education: Education[]
  skills: SkillGroup[]
}

export const uid = () => crypto.randomUUID()

export const blankResume = (): Resume => ({
  basics: { name: '', title: '', email: '', phone: '', location: '', link: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
})

export const sampleResume = (): Resume => ({
  basics: {
    name: 'Your Name', title: 'Software Engineer', email: 'you@example.com',
    phone: '+91 00000 00000', location: 'Chennai, India', link: 'github.com/your-handle',
    summary: 'Engineer who ships reliable web products. Replace this text with two or three sentences about you.',
  },
  experience: [{
    id: uid(), company: 'Company Name', role: 'Role Title', start: '2022', end: 'Present',
    bullets: 'Describe one result you delivered, with a number if you can\nDescribe another, starting with a strong verb',
  }],
  education: [{ id: uid(), school: 'University Name', degree: 'B.Tech, Computer Science', start: '2018', end: '2022' }],
  skills: [{ id: uid(), label: 'Languages', items: 'TypeScript, Python, SQL' }],
})
