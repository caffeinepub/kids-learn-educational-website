import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Star, Volume2, Trophy } from "lucide-react";
import { toast } from "sonner";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const COLORS = [
  { name: "Red", value: "bg-red-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Yellow", value: "bg-yellow-400" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Orange", value: "bg-orange-500" },
];
const SHAPES = [
  { name: "Circle", emoji: "⭕" },
  { name: "Square", emoji: "🟦" },
  { name: "Triangle", emoji: "🔺" },
  { name: "Star", emoji: "⭐" },
  { name: "Heart", emoji: "❤️" },
];

type GameType = "alphabet" | "numbers" | "colors" | "shapes" | null;

export function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [score, setScore] = useState(0);

  const handleLetterClick = (letter: string) => {
    toast.success(`Great job! You clicked ${letter}! 🎉`, {
      description: "Keep learning the alphabet!",
    });
    setScore((prev) => prev + 1);
  };

  const handleNumberClick = (num: number) => {
    toast.success(`Awesome! That's the number ${num}! 🎊`, {
      description: "You're great at counting!",
    });
    setScore((prev) => prev + 1);
  };

  const handleColorClick = (color: string) => {
    toast.success(`Perfect! That's ${color}! 🌈`, {
      description: "You know your colors!",
    });
    setScore((prev) => prev + 1);
  };

  const handleShapeClick = (shape: string) => {
    toast.success(`Excellent! That's a ${shape}! ✨`, {
      description: "You're a shape master!",
    });
    setScore((prev) => prev + 1);
  };

  const resetGame = () => {
    setSelectedGame(null);
    setScore(0);
  };

  if (selectedGame === "alphabet") {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 animate-bounce-in">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={resetGame}
              variant="outline"
              size="lg"
              className="border-2 border-games"
            >
              ← Back to Games
            </Button>
            <Badge className="bg-games text-white text-lg px-4 py-2 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Score: {score}
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-xl">
            <CardHeader>
              <CardTitle className="font-fredoka text-3xl sm:text-4xl text-games text-center">
                🔤 Alphabet Learning Game
              </CardTitle>
              <p className="font-comic text-center text-muted-foreground">
                Click on the letters and learn the alphabet!
              </p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
                {ALPHABET.map((letter, index) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    className="animate-bounce-in-delayed aspect-square bg-gradient-to-br from-games/20 to-games/5 border-4 border-games/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-6 active:scale-95"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <span className="font-fredoka text-2xl sm:text-3xl font-bold text-games">
                      {letter}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedGame === "numbers") {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 animate-bounce-in">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={resetGame}
              variant="outline"
              size="lg"
              className="border-2 border-games"
            >
              ← Back to Games
            </Button>
            <Badge className="bg-games text-white text-lg px-4 py-2 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Score: {score}
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-xl">
            <CardHeader>
              <CardTitle className="font-fredoka text-3xl sm:text-4xl text-games text-center">
                🔢 Number Counting Game
              </CardTitle>
              <p className="font-comic text-center text-muted-foreground">
                Click on the numbers and practice counting!
              </p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
                {NUMBERS.map((num, index) => (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    className="animate-bounce-in-delayed aspect-square bg-gradient-to-br from-games/20 to-games/5 border-4 border-games/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-6 active:scale-95"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="font-fredoka text-3xl sm:text-4xl font-bold text-games">
                        {num}
                      </span>
                      <div className="flex flex-wrap gap-1 justify-center px-2">
                        {[...Array(num)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-games fill-games"
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedGame === "colors") {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 animate-bounce-in">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={resetGame}
              variant="outline"
              size="lg"
              className="border-2 border-games"
            >
              ← Back to Games
            </Button>
            <Badge className="bg-games text-white text-lg px-4 py-2 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Score: {score}
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-xl">
            <CardHeader>
              <CardTitle className="font-fredoka text-3xl sm:text-4xl text-games text-center">
                🌈 Color Matching Game
              </CardTitle>
              <p className="font-comic text-center text-muted-foreground">
                Click on the colors and learn their names!
              </p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                {COLORS.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorClick(color.name)}
                    className="animate-bounce-in-delayed group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-gradient-to-br from-games/20 to-games/5 border-4 border-games/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-6 sm:p-8 flex flex-col items-center gap-4">
                      <div
                        className={`w-24 h-24 sm:w-32 sm:h-32 ${color.value} rounded-2xl border-4 border-white shadow-lg transition-transform group-hover:rotate-12`}
                      />
                      <span className="font-fredoka text-xl sm:text-2xl font-bold text-foreground">
                        {color.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedGame === "shapes") {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 animate-bounce-in">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={resetGame}
              variant="outline"
              size="lg"
              className="border-2 border-games"
            >
              ← Back to Games
            </Button>
            <Badge className="bg-games text-white text-lg px-4 py-2 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Score: {score}
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-xl">
            <CardHeader>
              <CardTitle className="font-fredoka text-3xl sm:text-4xl text-games text-center">
                🔶 Shape Recognition Game
              </CardTitle>
              <p className="font-comic text-center text-muted-foreground">
                Click on the shapes and learn their names!
              </p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                {SHAPES.map((shape, index) => (
                  <button
                    key={shape.name}
                    onClick={() => handleShapeClick(shape.name)}
                    className="animate-bounce-in-delayed group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-gradient-to-br from-games/20 to-games/5 border-4 border-games/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-6 sm:p-8 flex flex-col items-center gap-4">
                      <div className="text-7xl sm:text-8xl transition-transform group-hover:rotate-12">
                        {shape.emoji}
                      </div>
                      <span className="font-fredoka text-xl sm:text-2xl font-bold text-foreground">
                        {shape.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Game Selection Screen
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center mb-8 sm:mb-12 animate-bounce-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-games" strokeWidth={2.5} />
          <h1 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-games text-shadow-fun">
            Games
          </h1>
        </div>
        <p className="font-comic text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Play fun games and learn at the same time! 🎮✨
        </p>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedGame("alphabet")}
          className="animate-bounce-in-delayed group text-left"
          style={{ animationDelay: "0s" }}
        >
          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="text-6xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12">
                🔤
              </div>
              <h3 className="font-fredoka text-xl sm:text-2xl font-bold text-foreground mb-2">
                Alphabet Game
              </h3>
              <p className="font-comic text-sm text-muted-foreground">
                Learn the ABCs by clicking on letters!
              </p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => setSelectedGame("numbers")}
          className="animate-bounce-in-delayed group text-left"
          style={{ animationDelay: "0.1s" }}
        >
          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="text-6xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12">
                🔢
              </div>
              <h3 className="font-fredoka text-xl sm:text-2xl font-bold text-foreground mb-2">
                Number Game
              </h3>
              <p className="font-comic text-sm text-muted-foreground">
                Practice counting with numbers!
              </p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => setSelectedGame("colors")}
          className="animate-bounce-in-delayed group text-left"
          style={{ animationDelay: "0.2s" }}
        >
          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="text-6xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12">
                🌈
              </div>
              <h3 className="font-fredoka text-xl sm:text-2xl font-bold text-foreground mb-2">
                Color Game
              </h3>
              <p className="font-comic text-sm text-muted-foreground">
                Match colors and learn their names!
              </p>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => setSelectedGame("shapes")}
          className="animate-bounce-in-delayed group text-left"
          style={{ animationDelay: "0.3s" }}
        >
          <Card className="bg-gradient-to-br from-games/10 to-games/5 border-4 border-games/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 h-full">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="text-6xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12">
                🔶
              </div>
              <h3 className="font-fredoka text-xl sm:text-2xl font-bold text-foreground mb-2">
                Shape Game
              </h3>
              <p className="font-comic text-sm text-muted-foreground">
                Identify shapes and have fun!
              </p>
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  );
}
