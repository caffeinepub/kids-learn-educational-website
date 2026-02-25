import { Link } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Gamepad2,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useListPoems, useListStories, useListGames, useListEducationalModules } from "@/hooks/useQueries";

export function AdminDashboard() {
  const { data: poems = [] } = useListPoems();
  const { data: stories = [] } = useListStories();
  const { data: games = [] } = useListGames();
  const { data: modules = [] } = useListEducationalModules();

  const sections = [
    {
      title: "Poems",
      description: "Manage poetry content",
      icon: BookMarked,
      path: "/admin/poems",
      count: poems.length,
      color: "text-poems",
      bgColor: "bg-poems/10 hover:bg-poems/20",
    },
    {
      title: "Stories",
      description: "Manage story content",
      icon: BookOpen,
      path: "/admin/stories",
      count: stories.length,
      color: "text-stories",
      bgColor: "bg-stories/10 hover:bg-stories/20",
    },
    {
      title: "Games",
      description: "Manage interactive games",
      icon: Gamepad2,
      path: "/admin/games",
      count: games.length,
      color: "text-games",
      bgColor: "bg-games/10 hover:bg-games/20",
    },
    {
      title: "Educational Modules",
      description: "Manage learning modules",
      icon: GraduationCap,
      path: "/admin/modules",
      count: modules.length,
      color: "text-education",
      bgColor: "bg-education/10 hover:bg-education/20",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-fredoka font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage all content for the Kids Learning website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path}>
              <Card
                className={`transition-all duration-300 ${section.bgColor} border-2 cursor-pointer hover:shadow-lg hover:scale-[1.02]`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-8 h-8 ${section.color}`} />
                      <CardTitle className="text-2xl font-fredoka">
                        {section.title}
                      </CardTitle>
                    </div>
                    <div className="text-3xl font-bold text-muted-foreground">
                      {section.count}
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to manage {section.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
