import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, Zap } from "lucide-react";

const problems = [
  {
    title: "Information Overload",
    description:
      "Companies find it challenging to interpret massive volumes of complex data, leading to missed opportunities for growth and innovation.",
    icon: Brain,
  },
  {
    title: "Delayed Decision-Making",
    description:
      "Conventional data processing techniques are inefficient, causing businesses to fall behind market trends and lose key opportunities.",
    icon: Zap,
  },
  {
    title: "Concerns Over Data Security",
    description:
      "As cyber threats rise, organizations fear for the security of their sensitive data when integrating new technologies.",
    icon: Shield,
  },
];


export default function Component() {
  return (
    <Section
      title="Problem"
      subtitle="Manually entering your data is a hassle."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
