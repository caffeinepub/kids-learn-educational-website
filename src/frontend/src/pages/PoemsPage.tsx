import { Link } from "@tanstack/react-router";
import { useListPoems } from "../hooks/useQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookMarked, ArrowRight } from "lucide-react";
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

export function PoemsPage() {
  const { data: poems, isLoading, isError } = useListPoems();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center mb-8 sm:mb-12 animate-bounce-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookMarked className="w-12 h-12 sm:w-16 sm:h-16 text-poems" strokeWidth={2.5} />
          <h1 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-poems text-shadow-fun">
            Poems
          </h1>
        </div>
        <p className="font-comic text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Beautiful poems and rhymes to read and enjoy! 📖✨
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
                <Skeleton className="h-32 w-full mb-4" />
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
            Oops! Something went wrong loading the poems. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && poems?.length === 0 && (
        <div className="text-center py-12 animate-bounce-in">
          <BookMarked className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <p className="font-comic text-xl text-muted-foreground">
            No poems available yet. Check back soon! 🌟
          </p>
        </div>
      )}

      {/* Poems Grid */}
      {!isLoading && !isError && poems && poems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {poems.map((poem, index) => (
            <Link
              key={poem.id.toString()}
              to="/poems/$id"
              params={{ id: poem.id.toString() }}
              className="animate-bounce-in-delayed group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card className="bg-gradient-to-br from-poems/10 to-poems/5 border-4 border-poems/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full">
                <CardHeader>
                  <CardTitle className="font-fredoka text-2xl text-foreground flex items-start justify-between gap-2">
                    <span className="line-clamp-2">{poem.title}</span>
                    <ArrowRight className="w-5 h-5 text-poems shrink-0 transition-transform group-hover:translate-x-1" />
                  </CardTitle>
                  <Badge className="bg-poems text-white w-fit">{convertEnumToAgeGroup(poem.ageGroup)}</Badge>
                </CardHeader>
                <CardContent>
                  {poem.image && (
                    <div className="mb-4 rounded-xl overflow-hidden border-2 border-poems/30">
                      <img
                        src={poem.image.getDirectURL()}
                        alt={poem.title}
                        className="w-full h-40 object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                  )}
                  <p className="font-comic text-sm text-muted-foreground line-clamp-3 mb-2">
                    {poem.content}
                  </p>
                  <p className="font-comic text-xs text-poems font-semibold italic">
                    by {poem.author}
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
