import { useParams, Link } from "@tanstack/react-router";
import { useGetStory } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
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

export function StoryDetailPage() {
  const { id } = useParams({ from: "/stories/$id" });
  const storyId = BigInt(id);
  const { data: story, isLoading, isError } = useGetStory(storyId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card className="border-4">
          <CardContent className="p-8">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-80 w-full mb-6" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !story) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <Link to="/stories">
          <Button variant="outline" size="lg" className="mb-6 border-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </Button>
        </Link>
        <div className="text-center py-12">
          <BookOpen className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <p className="font-comic text-xl text-destructive">
            Oops! We couldn't find this story. 😢
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl animate-bounce-in">
      {/* Back Button */}
      <Link to="/stories">
        <Button
          variant="outline"
          size="lg"
          className="mb-6 sm:mb-8 border-2 border-stories hover:bg-stories/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Stories
        </Button>
      </Link>

      {/* Story Card */}
      <Card className="bg-gradient-to-br from-stories/10 to-stories/5 border-4 border-stories/40 shadow-xl">
        <CardContent className="p-6 sm:p-8 md:p-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-bold text-stories mb-4 text-shadow-fun">
              {story.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-stories text-white text-base px-4 py-1">
                {convertEnumToAgeGroup(story.ageGroup)}
              </Badge>
              <div className="flex items-center gap-2 text-base text-muted-foreground font-comic">
                <Clock className="w-5 h-5" />
                <span>{story.readingTime.toString()} min read</span>
              </div>
            </div>
            <p className="font-comic text-base sm:text-lg text-muted-foreground italic mt-3">
              by <span className="text-stories font-semibold">{story.author}</span>
            </p>
          </div>

          {/* Cover Image */}
          {story.coverImage && (
            <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border-4 border-stories/30 shadow-lg">
              <img
                src={story.coverImage.getDirectURL()}
                alt={story.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
            </div>
          )}

          {/* Story Content */}
          <div className="bg-card/50 rounded-2xl p-6 sm:p-8 border-2 border-stories/20">
            <div className="font-comic text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-foreground">
              {story.content}
            </div>
          </div>

          {/* End decoration */}
          <div className="text-center mt-8">
            <p className="font-fredoka text-2xl text-stories">✨ The End ✨</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
