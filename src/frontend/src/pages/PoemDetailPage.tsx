import { useParams, Link } from "@tanstack/react-router";
import { useGetPoem } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookMarked } from "lucide-react";
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

export function PoemDetailPage() {
  const { id } = useParams({ from: "/poems/$id" });
  const poemId = BigInt(id);
  const { data: poem, isLoading, isError } = useGetPoem(poemId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card className="border-4">
          <CardContent className="p-8">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-24 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !poem) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <Link to="/poems">
          <Button variant="outline" size="lg" className="mb-6 border-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Poems
          </Button>
        </Link>
        <div className="text-center py-12">
          <BookMarked className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <p className="font-comic text-xl text-destructive">
            Oops! We couldn't find this poem. 😢
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl animate-bounce-in">
      {/* Back Button */}
      <Link to="/poems">
        <Button
          variant="outline"
          size="lg"
          className="mb-6 sm:mb-8 border-2 border-poems hover:bg-poems/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Poems
        </Button>
      </Link>

      {/* Poem Card */}
      <Card className="bg-gradient-to-br from-poems/10 to-poems/5 border-4 border-poems/40 shadow-xl">
        <CardContent className="p-6 sm:p-8 md:p-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-bold text-poems mb-4 text-shadow-fun">
              {poem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-poems text-white text-base px-4 py-1">
                {convertEnumToAgeGroup(poem.ageGroup)}
              </Badge>
              <p className="font-comic text-base sm:text-lg text-muted-foreground italic">
                by <span className="text-poems font-semibold">{poem.author}</span>
              </p>
            </div>
          </div>

          {/* Image */}
          {poem.image && (
            <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border-4 border-poems/30 shadow-lg">
              <img
                src={poem.image.getDirectURL()}
                alt={poem.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Poem Content */}
          <div className="bg-card/50 rounded-2xl p-6 sm:p-8 border-2 border-poems/20">
            <pre className="font-comic text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-foreground">
              {poem.content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
