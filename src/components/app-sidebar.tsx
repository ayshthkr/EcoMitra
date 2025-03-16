"use client";

import { usePathname } from "next/navigation";
import {
  Command,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  PieChartIcon,
  Send,
  Signal,
  Bot,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser, NavUserLoading } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Banking",
      url: "/banking",
      icon: Layers,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: PieChartIcon,
    },
    {
      title: "Investments",
      url: "/investments",
      icon: Signal,
    },
    {
      title: "advisewithAI",
      url: "/talk",
      icon: Bot,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Add isActive property based on current pathname
  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-16 items-center justify-center rounded-lg">
                  <Image src={'/logo.png'} height={128} width={128} alt="logo" />
                </div>
                <div className="grid flex-1 text-left text-base font-semibold leading-tight">
                  <span className="truncate font-semibold">ECOMITRA</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {!isLoaded ? (
          <NavUserLoading />
        ) : (
          <NavUser
            user={{
              name: user?.fullName!,
              email: user?.emailAddresses![0].emailAddress!,
              avatar: user?.imageUrl!,
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
