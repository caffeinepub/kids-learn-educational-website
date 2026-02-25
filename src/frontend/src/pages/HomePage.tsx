import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    title: "Poems",
    description: "Read beautiful poems and rhymes!",
    image: "/assets/generated/poems-icon.dim_400x400.png",
    path: "/poems",
    colorClass: "bg-gradient-to-br from-poems/20 to-poems/5 hover:from-poems/30 hover:to-poems/10 border-poems/40",
  },
  {
    title: "Stories",
    description: "Explore wonderful stories and adventures!",
    image: "/assets/generated/stories-icon.dim_400x400.png",
    path: "/stories",
    colorClass: "bg-gradient-to-br from-stories/20 to-stories/5 hover:from-stories/30 hover:to-stories/10 border-stories/40",
  },
  {
    title: "Games",
    description: "Play fun and educational games!",
    image: "/assets/generated/games-icon.dim_400x400.png",
    path: "/games",
    colorClass: "bg-gradient-to-br from-games/20 to-games/5 hover:from-games/30 hover:to-games/10 border-games/40",
  },
  {
    title: "Learn",
    description: "Discover letters, numbers, colors and shapes!",
    image: "/assets/generated/education-icon.dim_400x400.png",
    path: "/education",
    colorClass: "bg-gradient-to-br from-education/20 to-education/5 hover:from-education/30 hover:to-education/10 border-education/40",
  },
];

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center mb-12 sm:mb-16 animate-bounce-in">
        <h1 className="font-fredoka text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 sm:mb-6 text-shadow-fun">
          Welcome to Kids Learn! 🎉
        </h1>
        <p className="font-comic text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          A magical place where learning is fun! Explore poems, stories, games, and more!
        </p>
        
        {/* Hero Image */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl mb-4 animate-bounce-in-delayed" style={{ animationDelay: "0.2s" }}>
          <img
            src="/assets/generated/hero-learning.dim_800x600.png"
            alt="Children learning together with books, games, and educational activities"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {categories.map((category, index) => {
          return (
            <Link
              key={category.path}
              to={category.path}
              className={`animate-bounce-in-delayed group`}
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <Card
                className={`${category.colorClass} border-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full`}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center h-full min-h-[240px] sm:min-h-[280px]">
                  <div className="mb-4 sm:mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300 w-24 h-24 sm:w-28 sm:h-28">
                    <img
                      src={category.image}
                      alt={`${category.title} - ${category.description}`}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <h2 className="font-fredoka text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-foreground">
                    {category.title}
                  </h2>
                  <p className="font-comic text-sm sm:text-base text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Fun CTA Section */}
      <section className="text-center mt-12 sm:mt-16 animate-bounce-in-delayed" style={{ animationDelay: "0.6s" }}>
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-6 sm:p-8 border-4 border-primary/20 shadow-lg max-w-3xl mx-auto">
          <h3 className="font-fredoka text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Ready to Start Learning? 🚀
          </h3>
          <p className="font-comic text-base sm:text-lg text-muted-foreground">
            Pick a category above and begin your amazing learning adventure today!
          </p>
        </div>
      </section>
    </div>
  );
}
