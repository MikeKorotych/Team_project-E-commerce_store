import ProductPageNav from "@/components/ProductPageNav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Linkedin, Mail, Copy, ExternalLink, Crown, ClipboardList, Code2 } from "lucide-react";
import { CardContainer, CardItem } from "@/components/ui/shadcn-io/3d-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const teamMembers = [
  {
    name: "Mykhailo Korotych",
    email: "misha.korotych@gmail.com",
    linkedin: "https://www.linkedin.com/in/михайло-коротич-1b34a0246/",
    avatar: "https://media.mate.academy/fit-in/128x128/users/156216/avatars/current-1750591618044.jpg",
  },
  {
    name: "Serhii Mashnin",
    email: "serhii.mashnin@gmail.com",
    linkedin: "https://www.linkedin.com/in/serhii-mashnin-4b148a359/",
    avatar: "https://media.mate.academy/fit-in/128x128/users/403005/avatars/current-1745586223332.jpg",
  },
  {
    name: "Oleksandr Savchuk",
    email: "sanchelo0822@gmail.com",
    linkedin: "https://www.linkedin.com/in/oleksandr-s-96861835a",
    avatar: "https://media.mate.academy/fit-in/128x128/users/395178/avatars/current-1746111587398.jpg",
  },
  {
    name: "Oleksandr Liesnoi",
    email: "oleksandr.liesnoi07@gmail.com",
    linkedin: "https://www.linkedin.com/in/oleksandr-liesnoi-7a12a437a/",
    avatar: "https://media.mate.academy/fit-in/128x128/users/829013/avatars/current-1749032468208.jpg",
  },
];

const roles = ["Team Lead", "Project Manager", "Developer", "Developer"] as const;

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "Team Lead":
      return "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30";
    case "Project Manager":
      return "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30";
    default:
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
  }
}

export const Contacts = () => (
  <>
    <ProductPageNav category="Contacts" />

    <h1 className="page-title">Contacts</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 items-stretch">
      {teamMembers.map((m, idx) => {
        const role = roles[idx] ?? "Developer";
        const RoleIcon = role === "Team Lead" ? Crown : role === "Project Manager" ? ClipboardList : Code2;
        const badge = getRoleBadgeClass(role);
        const [firstName, ...restName] = m.name.split(" ");
        const lastName = restName.join(" ");
        return (
          <CardContainer key={`${m.name}-${m.email || m.linkedin}`} containerClassName="py-0 h-full" className="h-full">
            <Card className="w-full h-full overflow-hidden [transform-style:preserve-3d] bg-gradient-to-b from-[#191b2c] to-[#0f1121] border-[#2c2f3b] hover:border-indigo-500/40 transition-colors">
              <CardHeader className="p-0 [transform-style:preserve-3d]">  
                <CardItem translateZ="40">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-full h-[220px] object-cover"
                    loading="lazy"
                  />
                </CardItem>
              </CardHeader>
              <CardContent className="px-6 pt-6 pb-3 [transform-style:preserve-3d] flex flex-col h-full">
                <CardItem translateZ="30">
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${badge}`}>
                      <RoleIcon className="h-3.5 w-3.5 mr-1" />
                      {role}
                    </span>
                    <div className="text-lg font-semibold leading-tight">
                      <span className="block">{firstName}</span>
                      {lastName && <span className="block">{lastName}</span>}
                    </div>
                  </div>
                </CardItem>
                <CardItem translateZ="20" className="flex flex-col gap-2">
                  {m.email ? (
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm text-blue-300 hover:underline flex items-center gap-2 w-full"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="truncate flex-1" title={m.email}>{m.email}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">Email: —</span>
                  )}
                  {m.linkedin ? (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-300 hover:underline flex items-center gap-2 w-full"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">LinkedIn: —</span>
                  )}
                </CardItem>
                <CardItem translateZ="10" className="mt-auto pt-2.5 flex flex-col gap-2">
                  {m.email && (
                    <Button
                      variant="secondary"
                      className="px-3 py-2 w-full justify-center"
                      onClick={() => {
                        navigator.clipboard.writeText(m.email);
                        toast.success("Email copied");
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy email
                    </Button>
                  )}
                  {m.linkedin && (
                    <Button asChild className="px-3 py-2 w-full justify-center">
                      <a href={m.linkedin} target="_blank" rel="noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" /> Open LinkedIn
                      </a>
                    </Button>
                  )}
                </CardItem>
              </CardContent>
            </Card>
          </CardContainer>
        );
      })}
    </div>
  </>
);