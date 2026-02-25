import { Link } from "@tanstack/react-router";
import { useListStories } from "../hooks/useQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import type { AgeGroup } from "@/backend";

// Helper to convert backend AgeGroup enum to UI strings
function convertEnumToAgeGroup(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case "ages3to5": return "3-5";
    case "ages6to8": return "6-8";
    case "ages9to12": return "9-12";
    case "allAges": return "All Ages";
    default: return "All Ages";
  }
}

export function StoriesPage() {
  const { data: stories, isLoading, isError } = useListStories();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center mb-8 sm:mb-12 animate-bounce-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-stories" strokeWidth={2.5} />
          <h1 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-stories text-shadow-fun">
            Stories
          </h1>
        </div>
        <p className="font-comic text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Amazing adventures and wonderful tales await you! 📚🌟
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-4">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12">
          <p className="font-comic text-lg text-destructive">
            Oops! Something went wrong loading the stories. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && stories?.length === 0 && (
        <div className="text-center py-12 animate-bounce-in">
          <BookOpen className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <p className="font-comic text-xl text-muted-foreground">
            No stories available yet. Check back soon! 🌟
          </p>
        </div>
      )}

      {/* Stories Grid */}
      {!isLoading && !isError && stories && stories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <Link
              key={story.id.toString()}
              to="/stories/$id"
              params={{ id: story.id.toString() }}
              className="animate-bounce-in-delayed group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card className="bg-gradient-to-br from-stories/10 to-stories/5 border-4 border-stories/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full">
                <CardHeader>
                  <CardTitle className="font-fredoka text-2xl text-foreground flex items-start justify-between gap-2">
                    <span className="line-clamp-2">{story.title}</span>
                    <ArrowRight className="w-5 h-5 text-stories shrink-0 transition-transform group-hover:translate-x-1" />
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-stories text-white">{convertEnumToAgeGroup(story.ageGroup)}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-comic">
                      <Clock className="w-3 h-3" />
                      <span>{story.readingTime.toString()} min</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {story.coverImage && (
                    <div className="mb-4 rounded-xl overflow-hidden border-2 border-stories/30">
                      <img
                        src={story.coverImage.getDirectURL()}
                        alt={story.title}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                  )}
                  <p className="font-comic text-sm text-muted-foreground line-clamp-3 mb-2">
                    {story.content.substring(0, 150)}...
                  </p>
                  <p className="font-comic text-xs text-stories font-semibold italic">
                    by {story.author}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
