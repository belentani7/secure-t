/**
 * Instructor profiles for courses
 * Building community: who teaches, expertise, contact
 */

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  image?: string;
  courses: string[]; // course codes
  verified: boolean;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const instructors: Instructor[] = [
  {
    id: "instr-001",
    name: "Dr. Maria Santos",
    title: "Cybersecurity Architect",
    bio: "15+ years in incident response and threat intelligence. Former CISO at fintech. Passionate about evidence-based security.",
    expertise: ["Incident Response", "Forensics", "Threat Modeling", "SOC Operations"],
    courses: ["CY-101", "IR-401"],
    verified: true,
    social: {
      github: "maria-ciso",
      linkedin: "maria-santos-security",
    },
  },
  {
    id: "instr-002",
    name: "Alex Chen",
    title: "Network & Protocol Specialist",
    bio: "RFC reader. Built network monitoring systems. Teaches OSI layers with passion.",
    expertise: ["Networking", "Protocols", "Network Defense", "Packet Analysis"],
    courses: ["NET-201"],
    verified: true,
    social: {
      github: "alexchen-networking",
    },
  },
  {
    id: "instr-003",
    name: "Dr. James Wilson",
    title: "Linux & Systems Security",
    bio: "Kernel contributor. Linux Foundation instructor. Believes in secure defaults.",
    expertise: ["Linux Hardening", "Kernel Security", "System Administration", "DevSecOps"],
    courses: ["LX-105"],
    verified: true,
    social: {
      github: "james-linux",
      twitter: "@james_linux",
    },
  },
  {
    id: "instr-004",
    name: "Sofia Rodríguez",
    title: "Python & Automation Engineer",
    bio: "Automates security workflows. Security tools developer. Believes code is poetry.",
    expertise: ["Python", "Automation", "Security Tools", "Network Tools"],
    courses: ["CS-110"],
    verified: true,
    social: {
      github: "sofia-automation",
      linkedin: "sofia-rodriguez-dev",
    },
  },
  {
    id: "instr-005",
    name: "Dr. Priya Patel",
    title: "Web & Application Security Lead",
    bio: "OWASP contributor. Tested apps at scale. Teaches real-world vulnerability assessment.",
    expertise: ["Web Security", "OWASP", "Secure Coding", "API Security", "Penetration Testing"],
    courses: ["WEB-301"],
    verified: true,
    social: {
      github: "priya-appsec",
      twitter: "@priya_security",
    },
  },
];

export function getInstructor(id: string): Instructor | undefined {
  return instructors.find(i => i.id === id);
}

export function getInstructorsByCourse(courseCode: string): Instructor[] {
  return instructors.filter(i => i.courses.includes(courseCode));
}
