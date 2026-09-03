/**
 * Curriculum structure: Bachelor of Cybersecurity
 * 4-year program, 120 credits, evidence-based competencies
 */

export interface Lesson {
  id: string;
  title: string;
  duration: number; // minutes
  type: "video" | "lab" | "reading" | "quiz" | "project";
  status: "locked" | "available" | "in_progress" | "completed";
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  competencies: string[];
}

export interface Course {
  code: string;
  title: string;
  year: 1 | 2 | 3 | 4;
  credits: number;
  description: string;
  modules: Module[];
  prerequisites: string[];
  outcomes: string[];
}

export interface Program {
  code: string;
  title: string;
  duration: "4 years";
  credits: 120;
  description: string;
  courses: Course[];
  competencies: string[];
}

export const curriculum: Program = {
  code: "BSCY",
  title: "Bachelor of Cybersecurity",
  duration: "4 years",
  credits: 120,
  description:
    "A comprehensive 4-year cybersecurity program combining theory, labs, and real-world incident response.",
  competencies: [
    "Linux & OS hardening",
    "Network protocols & defense",
    "Cryptography & PKI",
    "Web security & OWASP",
    "Cloud security (AWS/Azure)",
    "Forensics & incident response",
    "Reverse engineering",
    "Threat modeling",
    "Compliance (SOC2, ISO27001)",
    "Security operations (SOC)",
  ],
  courses: [
    {
      code: "CY-101",
      title: "Cybersecurity Fundamentals",
      year: 1,
      credits: 3,
      description: "Introduction to security principles, threat landscape, and career paths.",
      prerequisites: [],
      outcomes: [
        "Understand core security concepts (CIA triad, defense in depth)",
        "Recognize common attack vectors",
        "Apply risk assessment frameworks",
      ],
      modules: [
        {
          id: "cy101-m01",
          title: "Security Foundations",
          description: "CIA triad, threat modeling, defense strategies",
          competencies: ["threat modeling"],
          lessons: [
            {
              id: "cy101-l01",
              title: "What is cybersecurity?",
              duration: 45,
              type: "video",
              status: "available",
            },
            {
              id: "cy101-l02",
              title: "CIA Triad deep dive",
              duration: 30,
              type: "reading",
              status: "available",
            },
            {
              id: "cy101-l03",
              title: "Risk assessment workshop",
              duration: 90,
              type: "lab",
              status: "locked",
            },
          ],
        },
      ],
    },
    {
      code: "CS-110",
      title: "Python for Cybersecurity",
      year: 1,
      credits: 4,
      description: "Learn Python for security automation, network tools, and malware analysis.",
      prerequisites: [],
      outcomes: [
        "Write Python scripts for network scanning",
        "Automate security tasks",
        "Parse security logs",
      ],
      modules: [
        {
          id: "cs110-m01",
          title: "Python Basics for Security",
          description: "Syntax, libraries, automation",
          competencies: [],
          lessons: [
            {
              id: "cs110-l01",
              title: "Python setup & environment",
              duration: 30,
              type: "video",
              status: "available",
            },
            {
              id: "cs110-l02",
              title: "Network scanning script (nmap wrapper)",
              duration: 120,
              type: "lab",
              status: "available",
            },
          ],
        },
      ],
    },
    {
      code: "NET-201",
      title: "Networks & Protocols",
      year: 1,
      credits: 4,
      description: "OSI model, TCP/IP, DNS, TLS, network defense mechanisms.",
      prerequisites: [],
      outcomes: [
        "Understand OSI layers and attack surfaces",
        "Analyze network traffic (Wireshark)",
        "Defend against network attacks",
      ],
      modules: [
        {
          id: "net201-m01",
          title: "OSI Model & TCP/IP",
          description: "7 layers, protocol stack, packet anatomy",
          competencies: ["network protocols & defense"],
          lessons: [
            {
              id: "net201-l01",
              title: "OSI model explained",
              duration: 60,
              type: "video",
              status: "available",
            },
            {
              id: "net201-l02",
              title: "Packet capture & analysis",
              duration: 150,
              type: "lab",
              status: "available",
            },
          ],
        },
      ],
    },
    {
      code: "LX-105",
      title: "Linux Administration",
      year: 1,
      credits: 4,
      description: "Linux kernel, file systems, users, processes, and hardening.",
      prerequisites: [],
      outcomes: [
        "Manage Linux users and permissions",
        "Harden Linux systems",
        "Automate administration with bash",
      ],
      modules: [
        {
          id: "lx105-m01",
          title: "Linux Basics & Hardening",
          description: "File systems, permissions, SELinux, firewall",
          competencies: ["Linux & OS hardening"],
          lessons: [
            {
              id: "lx105-l01",
              title: "Linux file system hierarchy",
              duration: 45,
              type: "video",
              status: "available",
            },
            {
              id: "lx105-l02",
              title: "User management & sudo",
              duration: 60,
              type: "lab",
              status: "available",
            },
            {
              id: "lx105-l03",
              title: "Firewall & SELinux hardening",
              duration: 120,
              type: "lab",
              status: "locked",
            },
          ],
        },
      ],
    },
    {
      code: "WEB-301",
      title: "Web Application Security",
      year: 2,
      credits: 4,
      description: "OWASP Top 10, secure coding, authentication, and API security.",
      prerequisites: ["CS-110"],
      outcomes: [
        "Identify and exploit OWASP Top 10 vulnerabilities",
        "Secure web applications",
        "Test APIs for security",
      ],
      modules: [
        {
          id: "web301-m01",
          title: "OWASP & Common Vulns",
          description: "Injection, auth bypass, crypto failures",
          competencies: ["web security & OWASP"],
          lessons: [
            {
              id: "web301-l01",
              title: "SQL injection mastery",
              duration: 120,
              type: "lab",
              status: "locked",
            },
          ],
        },
      ],
    },
    {
      code: "IR-401",
      title: "Incident Response & Forensics",
      year: 3,
      credits: 4,
      description: "Incident handling, digital forensics, chain of custody, log analysis.",
      prerequisites: ["LX-105", "NET-201"],
      outcomes: [
        "Respond to security incidents",
        "Preserve forensic evidence",
        "Analyze logs and timelines",
      ],
      modules: [
        {
          id: "ir401-m01",
          title: "Incident Response Lifecycle",
          description: "Preparation, detection, containment, eradication, recovery",
          competencies: ["Forensics & incident response"],
          lessons: [
            {
              id: "ir401-l01",
              title: "IR playbooks & runbooks",
              duration: 90,
              type: "reading",
              status: "locked",
            },
          ],
        },
      ],
    },
  ],
};

export function getCourse(code: string): Course | undefined {
  return curriculum.courses.find(c => c.code === code);
}

export function getCoursesForYear(year: 1 | 2 | 3 | 4): Course[] {
  return curriculum.courses.filter(c => c.year === year);
}
