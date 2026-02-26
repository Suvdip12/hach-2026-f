import {
  HomeIcon,
  InfoIcon,
  PhoneIcon,
  Code,
  BrainCircuit,
  Bot,
  Lightbulb,
  LogIn,
} from "lucide-react";

export const routes = [
  {
    path: "/",
    label: "Home",
    icon: <HomeIcon size={20} />,
  },
  {
    path: "/about",
    label: "About",
    icon: <InfoIcon size={20} />,
  },
  {
    path: "/contact",
    label: "Contact",
    icon: <PhoneIcon size={20} />,
  },
];

export const authRoutes = [
  {
    path: "/login?option=student",
    label: "Login",
    icon: <LogIn size={20} />,
  },
];

export const curioRoutes = [
  {
    path: "/curiocode",
    label: "CurioCode",
    icon: <Code size={20} />,
    description: "Coding & Programming",
  },
  {
    path: "/curioai",
    label: "CurioAI",
    icon: <BrainCircuit size={20} />,
    description: "Artificial Intelligence",
  },
  {
    path: "/curiobot",
    label: "CurioBot",
    icon: <Bot size={20} />,
    description: "Robotics",
  },
  {
    path: "/curiothink",
    label: "CurioThink",
    icon: <Lightbulb size={20} />,
    description: "Critical Thinking",
  },
];
