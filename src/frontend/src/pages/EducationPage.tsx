import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

type ModuleType = "alphabet" | "numbers" | "colors" | "shapes";

interface LearningModule {
  id: string;
  title: string;
  items: Array<{ label: string; visual: string }>;
}

const LEARNING_MODULES: LearningModule[] = [
  {
    id: "alphabet",
    title: "🔤 The Alphabet",
    items: [
      { label: "A is for Apple", visual: "🍎" },
      { label: "B is for Ball", visual: "⚽" },
      { label: "C is for Cat", visual: "🐱" },
      { label: "D is for Dog", visual: "🐶" },
      { label: "E is for Elephant", visual: "🐘" },
      { label: "F is for Fish", visual: "🐠" },
      { label: "G is for Giraffe", visual: "🦒" },
      { label: "H is for House", visual: "🏠" },
      { label: "I is for Ice Cream", visual: "🍦" },
      { label: "J is for Jellyfish", visual: "🪼" },
      { label: "K is for Kite", visual: "🪁" },
      { label: "L is for Lion", visual: "🦁" },
      { label: "M is for Moon", visual: "🌙" },
      { label: "N is for Nest", visual: "🪺" },
      { label: "O is for Orange", visual: "🍊" },
      { label: "P is for Penguin", visual: "🐧" },
      { label: "Q is for Queen", visual: "👑" },
      { label: "R is for Rainbow", visual: "🌈" },
      { label: "S is for Sun", visual: "☀️" },
      { label: "T is for Tree", visual: "🌳" },
      { label: "U is for Umbrella", visual: "☂️" },
      { label: "V is for Violin", visual: "🎻" },
      { label: "W is for Whale", visual: "🐋" },
      { label: "X is for Xylophone", visual: "🎹" },
      { label: "Y is for Yellow", visual: "🟡" },
      { label: "Z is for Zebra", visual: "🦓" },
    ],
  },
  {
    id: "numbers",
    title: "🔢 Numbers 1-10",
    items: [
      { label: "1 - One", visual: "1️⃣" },
      { label: "2 - Two", visual: "2️⃣" },
      { label: "3 - Three", visual: "3️⃣" },
      { label: "4 - Four", visual: "4️⃣" },
      { label: "5 - Five", visual: "5️⃣" },
      { label: "6 - Six", visual: "6️⃣" },
      { label: "7 - Seven", visual: "7️⃣" },
      { label: "8 - Eight", visual: "8️⃣" },
      { label: "9 - Nine", visual: "9️⃣" },
      { label: "10 - Ten", visual: "🔟" },
    ],
  },
  {
    id: "colors",
    title: "🌈 Colors",
    items: [
      { label: "Red", visual: "🔴" },
      { label: "Blue", visual: "🔵" },
      { label: "Green", visual: "🟢" },
      { label: "Yellow", visual: "🟡" },
      { label: "Purple", visual: "🟣" },
      { label: "Orange", visual: "🟠" },
      { label: "Pink", visual: "🩷" },
      { label: "Brown", visual: "🟤" },
      { label: "Black", visual: "⚫" },
      { label: "White", visual: "⚪" },
    ],
  },
  {
    id: "shapes",
    title: "🔶 Shapes",
    items: [
      { label: "Circle", visual: "⭕" },
      { label: "Square", visual: "🟦" },
      { label: "Triangle", visual: "🔺" },
      { label: "Rectangle", visual: "🟥" },
      { label: "Star", visual: "⭐" },
      { label: "Heart", visual: "❤️" },
      { label: "Diamond", visual: "💎" },
      { label: "Oval", visual: "🥚" },
    ],
  },
];

export function EducationPage() {
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const module = LEARNING_MODULES.find((m) => m.id === selectedModule);

  const handleNext = () => {
    if (module && currentIndex < module.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetModule = () => {
    setSelectedModule(null);
    setCurrentIndex(0);
  };

  if (selectedModule && module) {
    const currentItem = module.items[currentIndex];

    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 animate-bounce-in">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={resetModule}
              variant="outline"
              size="lg"
              className="border-2 border-education"
            >
              ← Back
            </Button>
            <Badge className="bg-education text-white text-lg px-4 py-2">
              {currentIndex + 1} / {module.items.length}
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-education/10 to-education/5 border-4 border-education/40 shadow-xl">
            <CardContent className="p-8 sm:p-12 md:p-16">
              <h2 className="font-fredoka text-2xl sm:text-3xl text-education text-center mb-8">
                {module.title}
              </h2>

              <div className="bg-card/80 rounded-3xl p-8 sm:p-12 border-4 border-education/20 shadow-lg mb-8 min-h-[300px] flex flex-col items-center justify-center">
                <div className="text-8xl sm:text-9xl mb-6 animate-bounce-in">
                  {currentItem.visual}
                </div>
                <p className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-center">
                  {currentItem.label}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  size="lg"
                  className="bg-education hover:bg-education/90 text-white font-fredoka text-lg px-6 py-6 rounded-2xl shadow-lg disabled:opacity-50"
                >
                  <ChevronLeft className="w-6 h-6 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {module.items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-education scale-125"
                          : "bg-education/30 hover:bg-education/50"
                      }`}
                      aria-label={`Go to item ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={currentIndex === module.items.length - 1}
                  size="lg"
                  className="bg-education hover:bg-education/90 text-white font-fredoka text-lg px-6 py-6 rounded-2xl shadow-lg disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12 animate-bounce-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-education" strokeWidth={2.5} />
          <h1 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-education text-shadow-fun">
            Learn
          </h1>
        </div>
        <p className="font-comic text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose a learning module and discover amazing things!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {LEARNING_MODULES.map((module, index) => (
          <button
            key={module.id}
            onClick={() => setSelectedModule(module.id as ModuleType)}
            className="animate-bounce-in-delayed group text-left"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card className="bg-gradient-to-br from-education/10 to-education/5 border-4 border-education/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full">
              <CardContent className="p-6 sm:p-8 text-center min-h-[240px] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12">
                  {module.title.split(" ")[0]}
                </div>
                <h3 className="font-fredoka text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {module.title.split(" ").slice(1).join(" ")}
                </h3>
                <p className="font-comic text-sm text-muted-foreground">
                  {module.items.length} items to learn
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
